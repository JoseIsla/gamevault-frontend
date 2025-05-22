import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CategoryBar = () => {
  

  const navigate = useNavigate();
  const { t } = useLanguage();
  const categories = [
    { key: 'PC', label: 'PC' },
    { key: 'PSN', label: 'PSN' },
    { key: 'Xbox', label: 'Xbox' },
    { key: 'Nintendo', label: 'Nintendo' },
    { key: 'Prepago', label: 'prepago' },
    { key: 'Promociones', label: 'promociones' },
    { key: 'Ofertas Diarias', label: 'ofertasDiarias' },
    { key: 'Novedades', label: 'novedades' },
    { key: 'Próximamente', label: 'proximamente' }
  ];
  return (
    <div className="w-full bg-[#121212] border-b border-[#1e1e1e]">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 text-sm font-semibold uppercase text-white">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => navigate(`/category/${encodeURIComponent(key)}`)}
            className="hover:text-[#ff004c] transition cursor-pointer"
          >
            {t(label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;

  
  