import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Obtener datos completos del usuario desde el backend
  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('❌ Error al sincronizar datos del usuario:', err);
    }
  };

  // Login y sincronización completa
  const login = async (userData) => {
    const id = userData._id || userData.id;
    if (!id) return console.error('❌ ID de usuario no proporcionado');
    await fetchUserData(id); // carga el usuario desde la DB y guarda en localStorage
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Sincronizar al montar
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const id = parsed._id || parsed.id;
      if (id) fetchUserData(id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

