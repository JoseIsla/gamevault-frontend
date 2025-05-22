import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import SectionHeader from '../components/SectionHeader';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ProductPage = () => {
  const { id } = useParams();
  const { format } = useCurrency();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error al cargar producto:', err);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        if (product) {
          const filtered = data
            .filter((p) => p._id !== product._id && p.platform === product.platform)
            .slice(0, 4);
          setRelated(filtered);
        }
      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
      }
    };

    if (product) fetchRelated();
  }, [product]);


  if (!product) return <div className="text-center py-20">Cargando producto...</div>;

  const priceFinal = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row gap-8 bg-[#1e1e1e] p-6 rounded-lg shadow-md">
        <div className="relative w-full md:w-[300px]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain rounded"
          />
          {product.isUpcoming && (
            <div className="absolute top-2 left-2 bg-[#ffaa00] text-black text-xs px-2 py-1 rounded font-semibold">
              {t("proximamente")}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-sm text-[#e0e0e0] mb-2">{t("plataforma")}: {product.platform}</p>

          <div className="flex items-center gap-4 text-xl md:text-2xl font-bold mt-4">
            <span className="text-[#ff4c60]">{format(priceFinal)}</span>
            {product.discount > 0 && (
              <>
                <span className="line-through text-[#aaa] text-base">{format(product.price)}</span>
                <span className="bg-[#ff004c] text-white text-sm px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              className="bg-[#00bfa6] hover:bg-[#00a896] text-white font-bold px-6 py-2 rounded"
              onClick={() => addToCart(product)}
            >
              {t("comprarAhora")}
            </button>
            <button
              className="flex items-center gap-2 text-sm text-white hover:text-[#ff004c]"
              onClick={() => toggleFavorite(product)}
            >
              {isFavorite(product._id) ? <FaHeart /> : <FaRegHeart />}
              {t("añadirFavoritos")}
            </button>
          </div>


          <p
            className="text-sm mt-6 text-[#e0e0e0] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: t('descripcionProducto').replace('{{titulo}}', product.title),
            }}
          ></p>


          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-[#333] text-[#ff4c60] px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <SectionHeader title={`${t('gustarte')}`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
