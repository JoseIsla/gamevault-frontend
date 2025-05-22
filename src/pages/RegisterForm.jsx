import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.email !== form.confirmEmail) {
    return setError('Los correos no coinciden');
  }
  if (form.password !== form.confirmPassword) {
    return setError('Las contraseñas no coinciden');
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error al registrar');

    navigate('/login');

  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center px-4 pt-12 mt-[-210px]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] rounded-lg shadow-lg w-full max-w-4xl p-8 space-y-8"
      >
        <SectionHeader title="Crea tu cuenta" />

        {/* Información personal */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Apellidos</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="Tus apellidos"
              required
            />
          </div>
        </div>

        {/* Datos de acceso */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="email@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Confirmar correo</label>
            <input
              type="email"
              name="confirmEmail"
              value={form.confirmEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="Repite el correo"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="********"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#e0e0e0]">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded bg-[#121212] text-white placeholder-[#e0e0e0] focus:outline-none"
              placeholder="********"
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center font-semibold mt-2">{error}</p>
        )}

        {/* Botón */}
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-[#ff4c60] text-white rounded hover:bg-[#ff004c] transition"
          >
            Crear cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
