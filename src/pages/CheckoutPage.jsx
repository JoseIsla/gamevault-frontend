import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import SectionHeader from '../components/SectionHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cartItems, appliedCoupon, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // 🔒 Redirigir si no hay usuario logueado
  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [user, navigate, location.pathname]);

  const itemsWithFinalPrice = cartItems.map(item => {
    const basePrice = item.price;
    const finalPrice = appliedCoupon
      ? parseFloat((basePrice * (1 - appliedCoupon.discount / 100)).toFixed(2))
      : parseFloat(basePrice.toFixed(2));
    return {
      ...item,
      finalPrice
    };
  });

  const subtotal = itemsWithFinalPrice.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity * (appliedCoupon.discount / 100),
        0
      )
    : 0;

  const total = subtotal;

  const handleStripePayment = async () => {
    // Validación por si el usuario fue eliminado o expira sesión
    if (!user || !user._id) {
      alert('Debes iniciar sesión para completar tu compra.');
      return navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }

    try {
      const formattedItems = itemsWithFinalPrice.map(item => ({
        _id: item._id,
        title: item.title,
        image: item.image,
        platform: item.platform,
        quantity: item.quantity,
        price: item.finalPrice
      }));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          items: formattedItems,
          coupon: appliedCoupon,
          subtotal,
          discount: discountAmount,
          total,
          currency: currency.toLowerCase()
        }),
      });

      if (!res.ok) throw new Error('No se pudo crear la sesión de pago');

      const { id: sessionId } = await res.json();
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error('Stripe redirection error:', result.error.message);
        alert('Error al redirigir a Stripe.');
      }
    } catch (err) {
      console.error('Error con Stripe:', err.message);
      alert('Hubo un problema con el pago.');
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title={t("finalizarCompra")} />

        {/* Productos */}
        <div className="space-y-6 mb-6">
          {itemsWithFinalPrice.map((item) => (
            <div key={item._id} className="flex gap-4 bg-[#1e1e1e] p-4 rounded">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-[#aaa]">{item.platform}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{format(item.finalPrice)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="bg-[#1e1e1e] p-4 rounded shadow text-sm">
          <p className="mb-2">{t("subtotal")}: <strong>{format(subtotal)}</strong></p>
          {appliedCoupon && (
            <p className="mb-2 text-green-400">
              {t("cupon")} <strong>{appliedCoupon.code}</strong> {t("cuponAplicado")}: -{appliedCoupon.discount}% ({format(discountAmount)})
            </p>
          )}
          <p className="text-lg mt-2">{t("totalPagar")}: <strong>{format(total)}</strong></p>

          <button
            onClick={handleStripePayment}
            className="mt-4 w-full bg-[#00bfa6] hover:bg-[#00a896] text-white px-6 py-3 rounded font-bold"
          >
            {t("confirmarPago")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

