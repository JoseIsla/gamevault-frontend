import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        navigate('/');
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      alert('Error de servidor');
    }
  };


  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center px-4 pt-12 mt-[-210px]">
      <div className="w-full max-w-5xl mt-[-100px]">
        <SectionHeader title={`${t('logReg')}`}  />

        <div className="bg-[#1e1e1e] rounded-lg shadow-lg w-full p-8 flex flex-col md:flex-row gap-6">

          {/* LOGIN */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-bold text-[#ff004c] mb-4">t{("iniciarSesión")}</h3>
            <p className="text-[#e0e0e0] mb-4 text-sm">{t("inicioMensaje")}</p>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t("correo")}
              className="w-full mb-3 px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t("contraseña")}
              className="w-full mb-4 px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
            />

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-[#ff4c60] text-white rounded hover:bg-[#ff004c] transition"
            >
              {t("entrar")}
            </button>
          </div>

          {/* REGISTER */}
          <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-[#333] pt-6 md:pt-0 md:pl-6">
            <h3 className="text-lg font-bold text-[#ff004c] mb-4">{t("registrarse")}</h3>
            <p className="text-[#e0e0e0] mb-6 text-sm">
              {t("registroMensaje")}
            </p>
            <ul className="text-sm text-[#e0e0e0] space-y-2 mb-6">
              <li>✔ {t("consigue")}</li>
              <li>✔ {t("recibe")}</li>
              <li>✔ {t("forma")}</li>
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 bg-[#ff4c60] text-white rounded hover:bg-[#ff004c] transition"
            >
              {t("registrarse")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
