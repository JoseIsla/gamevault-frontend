import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
    const { t } = useLanguage();

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Link to={`/product/${product._id}`} className="block relative">
      <div className="bg-[#1e1e1e] rounded shadow-md overflow-hidden hover:scale-[1.02] transition">

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-[#ff004c] text-white text-xs px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {product.isUpcoming && (
          <div className="absolute top-2 left-2 bg-[#ffaa00] text-black text-xs px-2 py-1 rounded font-semibold">
            {t("proximamente")}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:text-[#ff004c]"
        >
          {isFavorite(product._id) ? <FaHeart /> : <FaRegHeart />}
        </button>

        <div className="p-4">
          <h3 className="text-white text-sm font-semibold mb-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-[#aaa] text-xs mb-2">{product.platform}</p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-white font-bold">
              <span className="text-[#ff4c60]">{format(discountedPrice)}</span>
              {product.discount > 0 && (
                <span className="text-[#aaa] text-xs line-through ml-2">{format(product.price)}</span>
              )}
            </div>
            <button
              className="bg-[#00bfa6] hover:bg-[#00a896] text-white text-xs px-3 py-1 rounded"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
            >
              {t("comprarAhora")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

