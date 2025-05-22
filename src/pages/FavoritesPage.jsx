import { useFavorites } from '../context/FavoritesContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import {useLanguage } from '../context/LanguageContext';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { format } = useCurrency();
   const { t } = useLanguage();

  if (!favorites.length) {
    return <div className="text-white p-8 text-center">{t("noFavoritos")}</div>;
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={`${t('misFavoritos')}`} />
        <div className="space-y-4 mt-6">
          {favorites.map(product => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="flex bg-[#1e1e1e] rounded overflow-hidden border border-[#333] hover:scale-[1.01] transition"
            >
              <img src={product.image} alt={product.title} className="w-32 h-32 object-contain" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                <p className="text-sm text-[#ccc] mb-1">{t("plataforma")}: {product.platform}</p>
                <p className="text-[#00bfa6] font-bold">
                  {format(product.price * (1 - (product.discount || 0) / 100))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;

