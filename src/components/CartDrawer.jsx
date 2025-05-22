import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  const { format } = useCurrency();
    const { t } = useLanguage();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleCart}
        />
      )}
  
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-[#1e1e1e] text-white shadow-lg z-50 transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Cabecera */}
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <h2 className="text-lg font-bold">{t("carrito")}</h2>
          <button
            onClick={toggleCart}
            className="text-[#ff004c] hover:text-red-300 text-xl font-bold transition"
          >
            ✕
          </button>
        </div>
  
        {/* Lista de productos con scroll */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <p className="text-[#aaa]">{t("carritoVacio")}</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[#ccc]">
                    {format(item.price)} x {item.quantity}
                  </p>
                  <div className="flex items-center mt-1 gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-2 bg-[#333] rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2 bg-[#333] rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-[#ff004c] text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
  
        {/* Totales + botones, fijo abajo */}
        <div className="p-4 border-t border-[#333]">
          <p className="font-bold text-sm mb-3">
            Subtotal: {format(subtotal)}
          </p>
          <Link
            to="/cart"
            onClick={toggleCart}
            className="block bg-white text-black text-sm font-bold py-2 text-center rounded mb-2 hover:bg-[#ddd] transition"
          >
            {t("verCesta")}
          </Link>
          <Link
            to="/checkout"
            onClick={toggleCart}
            className="block bg-[#00bfa6] hover:bg-[#00a896] text-white text-sm font-bold py-2 text-center rounded transition"
          >
            {t("pagoSeguro")}
          </Link>
        </div>
      </div>
    </>
  );
  
};

export default CartDrawer;

