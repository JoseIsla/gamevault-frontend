import SectionHeader from '../components/SectionHeader';
import UpcomingProductGrid from '../components/UpcomingProductGrid';

const UpcomingProducts = () => {
  return (
    <section className="max-w-[1200px] mx-auto py-10 px-4">
      <SectionHeader title="proximos" />
      <UpcomingProductGrid />
    </section>
  );
};

export default UpcomingProducts;
