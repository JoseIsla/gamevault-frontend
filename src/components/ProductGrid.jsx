import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?popular=true`);
      const data = await res.json();
      setProducts(data.slice(0, 8)); // solo los 8 primeros
    } catch (err) {
      console.error('Error al cargar productos populares:', err);
    }
  };

  fetchProducts();
}, []);


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
