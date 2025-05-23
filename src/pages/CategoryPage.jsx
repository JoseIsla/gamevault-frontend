import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const CategoryPage = () => {
  const { categoria } = useParams();
  const [products, setProducts] = useState([]);
  const { format } = useCurrency();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products?categoria=${encodeURIComponent(categoria)}`)
      .then(res => res.json())
      .then(data => setProducts(data || []))
      .catch(err => console.error('Error al cargar productos:', err));
  }, [categoria]);

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={`${t('filtradoPor')}: ${t(categoria)}`} />



        {products.length === 0 ? (
          <p className="text-[#aaa] text-center mt-10">{t("noResultados")}</p>
        ) : (
          <div className="space-y-4 mt-8">
            {products.map(product => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex bg-[#1e1e1e] rounded overflow-hidden hover:scale-[1.01] transition border border-[#333]"
              >
                <div className="relative w-40 h-40 flex-shrink-0 bg-[#1e1e1e]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  {product.isUpcoming && (
                    <div className="absolute top-2 left-2 bg-[#ffaa00] text-black text-xs px-2 py-1 rounded font-semibold">
                      {t("proximamente")}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  <p className="text-[#ccc] text-sm mb-1">{t("plataforma")}: {product.platform}</p>
                  {product.discount > 0 && (
                    <p className="text-sm text-[#ff004c] font-bold mb-1">-{product.discount}%</p>
                  )}
                  <div className="mt-2">
                    {product.discount > 0 ? (
                      <>
                        <p className="text-sm text-[#aaa] line-through">
                          {format(product.price)}
                        </p>
                        <p className="text-[#ff004c] text-xl font-bold">
                          {format(product.price * (1 - product.discount / 100))}
                        </p>
                      </>
                    ) : (
                      <p className="text-[#ff004c] text-xl font-bold">
                        {format(product.price)}
                      </p>
                    )}
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
