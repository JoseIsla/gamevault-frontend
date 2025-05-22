import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();


    return (
      <footer className="bg-[#121212] text-[#cfcfcf] text-sm text-center py-6">
        <p>&copy; {new Date().getFullYear()} GameVault. {t("copy")}.</p>
      </footer>
    );
  };
  
  export default Footer;
  