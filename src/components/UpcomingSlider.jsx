import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UpcomingSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/slider');
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error('Error al cargar el slider:', err);
      }
    };
    fetchSlides();
  }, []);

  // Cambio automático cada 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  return (
    <section className="w-full bg-black py-6">
      <div className="max-w-[1100px] mx-auto relative">
        <a href={slides[current].link} className="block overflow-hidden rounded-md shadow-lg transition duration-500 hover:opacity-90">
          <img
            src={slides[current]?.image}
            alt={slides[current]?.title}
            className="w-full object-cover max-h-[500px]"
            loading="lazy"
          />
        </a>
        {/* Botones */}
        <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#121212] text-white p-2 rounded-full hover:bg-[#ff004c] transition">
          <FaChevronLeft />
        </button>
        <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#121212] text-white p-2 rounded-full hover:bg-[#ff004c] transition">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default UpcomingSlider;

