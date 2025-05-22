import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/favorites/${user._id}`)
        .then(res => res.json())
        .then(data => setFavorites(data || []))
        .catch(err => console.error('Error cargando favoritos', err));
    } else {
      setFavorites([]); // limpieza si se desloguea
    }
  }, [user]);

  const addFavorite = async (product) => {
    if (!user) return;
    await fetch('http://localhost:5000/api/favorites/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, productId: product._id })
    });
    setFavorites(prev => [...prev, product]);
  };

  const removeFavorite = async (productId) => {
    if (!user) return;
    await fetch('http://localhost:5000/api/favorites/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, productId })
    });
    setFavorites(prev => prev.filter(p => p._id !== productId));
  };

  const toggleFavorite = (product) => {
    const exists = favorites.find(p => p._id === product._id);
    if (exists) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const isFavorite = (productId) => favorites.some(p => p._id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);


