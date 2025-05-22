import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const stored = localStorage.getItem('appliedCoupon');
    return stored ? JSON.parse(stored) : null;
  });

  // 🔄 Sincronización con localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // ✅ Añadir al carrito
  const addToCart = (product) => {
    const exists = cartItems.find(item => item._id === product._id);

    const finalPrice = product.discount
      ? parseFloat((product.price * (1 - product.discount / 100)).toFixed(2))
      : product.price;

    if (exists) {
      setCartItems(prev =>
        prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [
        ...prev,
        {
          ...product,
          quantity: 1,
          price: finalPrice  // 💡 Guardamos precio final directo
        }
      ]);
    }

    setIsCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeCart = () => setIsCartOpen(false);

  const applyCoupon = (coupon) => setAppliedCoupon(coupon);

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('appliedCoupon');
  };

  const removeCoupon = () => {
  setAppliedCoupon(null);
};


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        isCartOpen,
        toggleCart,
        closeCart,
        appliedCoupon,
        applyCoupon,
         removeCoupon, 
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
