import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const UpcomingProductGrid = () => {
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products?upcoming=true');
        const data = await res.json();
        setUpcoming(data.slice(0, 8)); // solo los 8 primeros
      } catch (err) {
        console.error('Error al cargar productos próximos:', err);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
      {upcoming.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default UpcomingProductGrid;
