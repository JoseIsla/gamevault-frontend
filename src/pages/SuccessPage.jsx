import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';

const SuccessPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/orders/session/${sessionId}`)
        .then(res => res.json())
        .then(data => setOrder(data.order))
        .catch(err => console.error('Error cargando orden:', err));
    }
  }, [sessionId]);


  if (!order) {
    return <div className="text-white text-center mt-10">Cargando pedido...</div>;
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="✅ Pedido confirmado" />
        <p className="mb-6 text-[#aaa]">Gracias por tu compra. Aquí tienes las claves de activación:</p>
        <ul className="space-y-4">
          {order.items.map((item, i) => (
            <li key={i} className="bg-[#1e1e1e] p-4 rounded border border-[#333]">
              <p><strong>{item.title}</strong> ({item.platform})</p>
              <p className="mt-2 text-[#00ffae] font-mono text-sm">Clave: {item.key}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuccessPage;




