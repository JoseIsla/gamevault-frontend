import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const currencyRef = useRef(null);
  const langRef = useRef(null);
  const searchRef = useRef(null); // NUEVO

  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const availableCurrencies = ['EUR', 'USD', 'GBP'];
  const { user } = useAuth();
  const { toggleCart } = useCart();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${query}`)
          .then(res => res.json())
          .then(data => setResults(data))
          .catch(err => console.error(err));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    setQuery('');
    setResults([]);
  };

  // Detectar clics fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#121212] shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex items-center justify-between gap-6">

        {/* Logo */}
        <div className="w-[200px] flex-shrink-0 flex items-center justify-start">
          <Link to="/">
            <img
              src={logo}
              alt="GameVault logo"
              className="h-14 -my-2 object-contain scale-[4] ml-[85px]"
            />
          </Link>
        </div>

        {/* Buscador */}
        <div ref={searchRef} className="relative w-[280px] md:w-[360px] flex-1 flex justify-center">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full py-3 pl-4 pr-10 rounded-full bg-white text-black text-base placeholder-gray-500 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-black" />
          <AnimatePresence>
            {results.length > 0 && (
              <motion.ul
                className="absolute top-14 left-0 w-full bg-white text-black rounded shadow-lg z-50 max-h-60 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {results.map((item) => (
                  <li
                    key={item._id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-3"
                    onClick={() => handleSelect(item._id)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-sm">{item.title}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Selectores + Iconos */}
        <div className="flex gap-5 items-center text-xl whitespace-nowrap translate-x-[-7px] relative">

          {/* Selector moneda */}
          <div className="relative" ref={currencyRef}>
            <div
              onClick={() => {
                setShowCurrencyMenu(prev => !prev);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-[#ff004c]"
            >
              <span>{currency}</span>
              <IoMdArrowDropdown />
            </div>

            {showCurrencyMenu && (
              <div
                onMouseLeave={() => setShowCurrencyMenu(false)}
                className="absolute top-full mt-1 right-0 bg-[#1e1e1e] text-white rounded shadow-md text-sm z-50"
              >
                {availableCurrencies.map((curr) => (
                  <div
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencyMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-[#ff004c] cursor-pointer"
                  >
                    {curr}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selector idioma */}
          <div className="relative" ref={langRef}>
            <div
              onClick={() => {
                setShowLangDropdown(prev => !prev);
                setShowCurrencyMenu(false);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-[#ff004c]"
            >
              <span>{language.toUpperCase()}</span>
              <IoMdArrowDropdown />
            </div>

            {showLangDropdown && (
              <div
                onMouseLeave={() => setShowLangDropdown(false)}
                className="absolute top-full mt-1 right-0 bg-[#1e1e1e] text-white rounded shadow-md text-sm z-50"
              >
                <div
                  onClick={() => {
                    setLanguage('es');
                    setShowLangDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-[#ff004c] cursor-pointer"
                >
                  Español
                </div>
                <div
                  onClick={() => {
                    setLanguage('en');
                    setShowLangDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-[#ff004c] cursor-pointer"
                >
                  English
                </div>
              </div>
            )}
          </div>

          {/* Iconos */}
          <FaHeart
            className="cursor-pointer hover:text-[#ff004c]"
            onClick={() => navigate(user ? "/favorites" : "/login")}
          />

          <Link to={user ? "/account" : "/login"}>
            <FaUser className="cursor-pointer hover:text-[#ff004c]" />
          </Link>
          <FaShoppingCart
            className="cursor-pointer hover:text-[#ff004c]"
            onClick={toggleCart}
          />
        </div>
      </div>

      {/* Cart Drawer visible en toda la app */}
      <CartDrawer />
    </nav>
  );
};

export default Navbar;
