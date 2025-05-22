import { useLanguage } from '../context/LanguageContext';

const SectionHeader = ({ title = "populares" }) => {
  const { t } = useLanguage();

  // Si existe una traducción definida para el título, úsala
  const translated = t(title) || title;

  return (
    <div className="flex items-center gap-4 px-4 md:px-0 mb-6">
      <h2 className="text-white text-xl md:text-2xl uppercase font-bold border border-white px-4 py-2 rounded-sm shadow-[0_0_12px_#ff004c]">
        {translated}
      </h2>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-white/50 to-transparent"></div>
    </div>
  );
};

export default SectionHeader;

  