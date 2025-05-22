import { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

const exchangeRates = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.85
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');

  const convert = (priceInEur) => {
    return priceInEur * exchangeRates[currency];
  };

  const format = (priceInEur) => {
    return `${convert(priceInEur).toFixed(2)} ${currency}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
