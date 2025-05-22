import { useState } from 'react';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#0f0f1a] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="text-2xl font-bold text-[#00ffe0]">
          GameVault
        </div>

        {/* MENÚ */}
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#" className="hover:text-[#00ffe0] transition">PC</a>
          <a href="#" className="hover:text-[#00ffe0] transition">PSN</a>
          <a href="#" className="hover:text-[#00ffe0] transition">Xbox</a>
          <a href="#" className="hover:text-[#00ffe0] transition">Nintendo</a>
          <a href="#" className="hover:text-[#00ffe0] transition">Ofertas</a>
        </nav>

        {/* ICONOS */}
        <div className="flex gap-4 text-xl items-center">
          <FaSearch className="cursor-pointer hover:text-[#00ffe0]" />
          <FaUser className="cursor-pointer hover:text-[#00ffe0]" />
          <FaHeart className="cursor-pointer hover:text-[#00ffe0]" />
          <FaShoppingCart className="cursor-pointer hover:text-[#00ffe0]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
