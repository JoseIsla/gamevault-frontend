import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/SectionHeader';
import { useLanguage } from '../context/LanguageContext';

const AccountPage = () => {
  const { user, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('datos');
  const [message, setMessage] = useState(null);
  const [orders, setOrders] = useState([]);
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 🔄 Cargar pedidos al entrar en la sección de pedidos
  useEffect(() => {
    if (activeSection === 'pedidos') {
      fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${user._id}`)

        .then(res => res.json())
        .then(data => setOrders(data.orders))
        .catch(err => console.error('Error cargando pedidos:', err));
    }
  }, [activeSection]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update/${user._id || user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');

      await login(data.user);
      setMessage({ type: 'success', text: 'Datos actualizados correctamente' });

      setTimeout(() => window.location.reload(), 2500);
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` });
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title={`${t('panelUsuario')}`} />

        <div className="flex flex-col md:flex-row mt-6 bg-[#1e1e1e] rounded shadow-lg overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-[#1e1e1e] p-6 border-r border-[#2e2e2e]">
            <h2 className="text-xl font-bold mb-4">{t("miCuenta")}</h2>
            <nav className="flex flex-col space-y-3">
              <button onClick={() => setActiveSection('datos')} className={`text-left hover:text-[#ff004c] ${activeSection === 'datos' ? 'text-[#ff004c]' : ''}`}>{t("datos")}</button>
              <button onClick={() => setActiveSection('config')} className={`text-left hover:text-[#ff004c] ${activeSection === 'config' ? 'text-[#ff004c]' : ''}`}>{t("config")}</button>
              <button onClick={() => setActiveSection('pedidos')} className={`text-left hover:text-[#ff004c] ${activeSection === 'pedidos' ? 'text-[#ff004c]' : ''}`}>{t("pedidos")}</button>
              <button
                onClick={logout}
                className="bg-[#ff004c] text-white text-sm py-1.5 px-3 rounded-md hover:bg-[#ff1a5c] transition mt-4"
              >
                {t("cerrarSesion")}
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 p-6">
            {message && (
              <div className={`text-sm p-3 rounded mb-6 ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                {message.text}
              </div>
            )}

            <h1 className="text-2xl font-bold mb-6">{t("bienvenida")} {user?.firstName}</h1>

            {activeSection === 'datos' && (
              <div className="space-y-2 mt-4">
                <p><strong>{t("nombre")}:</strong> {user?.firstName}</p>
                <p><strong>{t("apellido")}:</strong> {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            )}

            {activeSection === 'config' && (
              <div className="space-y-4 mt-4 max-w-lg">
                <div>
                  <label className="block text-sm">{t("nombre")}</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <div>
                  <label className="block text-sm">{t("apellido")}</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <div>
                  <label className="block text-sm">Email</label>
                  <input name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <div>
                  <label className="block text-sm">{t("contraseñaActual")}</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <div>
                  <label className="block text-sm">{t("nuevaContraseña")}</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <div>
                  <label className="block text-sm">{t("confirmarContraseña")}</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                    className="w-full p-2 bg-[#121212] border border-[#333] rounded" />
                </div>
                <button
                  onClick={handleUpdate}
                  className="bg-[#ff4c60] hover:bg-[#ff004c] text-white px-4 py-2 rounded mt-4"
                >
                  {t("actualizarDatos")}
                </button>
              </div>
            )}

            {activeSection === 'pedidos' && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <p className="text-[#ccc]">Aún no has realizado ningún pedido.</p>
                ) : (
                  orders.map((order, i) => (
                    <div key={i} className="bg-[#1e1e1e] p-4 rounded border border-[#333]">
                      <h3 className="font-bold text-lg mb-2">{t("pedidoDel")} {new Date(order.createdAt).toLocaleDateString()}</h3>
                      <ul className="space-y-2">
                        {order.items.map((item, j) => (
                          <li key={j} className="text-sm">
                            <span className="font-semibold">{item.title}</span> — {item.platform} — <span className="text-[#00bfa6] font-mono">{item.key || 'Clave no disponible'}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs text-[#aaa]">Total: {order.total} {order.currency.toUpperCase()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
