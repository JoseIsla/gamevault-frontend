// ...importaciones
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import SectionHeader from '../components/SectionHeader';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon
  } = useCart();

  const { format } = useCurrency();
  const { t } = useLanguage();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [showCouponBox, setShowCouponBox] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? subtotal * (appliedCoupon.discount / 100)
    : 0;

  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || appliedCoupon) return;

    try {
      const res = await fetch(`http://localhost:5000/api/coupons/${couponCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cupón inválido');

      applyCoupon(data);
      setCouponMessage({ type: 'success', text: t("cuponAplicado") });
      setCouponCode('');
    } catch (err) {
      setCouponMessage({ type: 'error', text: `❌ ${err.message}` });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponMessage(null);
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title={t("tuCesta")} />

        {/* Lista de productos */}
        <div className="space-y-6 mt-6">
          {cartItems.length === 0 ? (
            <p className="text-[#ccc]">{t("carritoVacio")}</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 bg-[#1e1e1e] p-4 rounded shadow">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <div className="text-sm mt-1 text-[#ccc] flex items-center gap-2">
                    <span className="text-[#ff4c60] font-bold">{format(item.price)}</span>
                    <span className="ml-1">x {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-2 bg-[#333] rounded"
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2 bg-[#333] rounded"
                    >+</button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-[#ff004c] font-bold text-xl"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cupón */}
        {cartItems.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowCouponBox(!showCouponBox)}
              className="w-full text-left text-[#ff004c] font-bold mb-2"
            >
              {showCouponBox ? `${t("ocultar")} ▲` : `${t("añadirCupon")} ▼`}
            </button>

            {showCouponBox && (
              <div className="bg-[#1e1e1e] p-4 rounded">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("introducirCodigo")}
                    disabled={!!appliedCoupon}
                    className="flex-1 px-4 py-2 rounded bg-[#121212] border border-[#333] text-white disabled:opacity-50"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!!appliedCoupon}
                    className="bg-[#ff4c60] hover:bg-[#ff004c] text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                  >
                    {t("aplicar")}
                  </button>
               
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Totales */}
        {cartItems.length > 0 && (
          <div className="mt-10 bg-[#1e1e1e] p-6 rounded shadow text-sm">
            <p className="mb-1">
              Subtotal: <strong>{format(subtotal)}</strong>
            </p>
            {appliedCoupon && (
              <p className="mb-1 text-green-400 flex justify-between items-center">
                <span>
                  {t("cupon")} <strong>{appliedCoupon.code}</strong> {t("cuponAplicado")}: -{appliedCoupon.discount}% ({format(discountAmount)})
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[#ff004c] ml-2 text-lg font-bold"
                  title={t("eliminarCupon")}
                >
                  ✕
                </button>
              </p>
            )}
            <p className="text-lg mt-2">
              Total: <strong>{format(total)}</strong>
            </p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-[#00bfa6] hover:bg-[#00a896] text-white px-6 py-3 rounded font-bold w-full text-center"
            >
              {t("pagoSeguro")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
