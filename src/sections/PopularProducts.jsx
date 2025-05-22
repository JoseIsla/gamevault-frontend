import SectionHeader from '../components/SectionHeader';
import ProductGrid from '../components/ProductGrid';

const PopularProducts = () => {
  return (
    <section className="max-w-[1200px] mx-auto py-10 px-4">
      <SectionHeader title="populares" />
      <ProductGrid />
    </section>
  );
};

export default PopularProducts;
