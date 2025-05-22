import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
 
      <CurrencyProvider>
        <LanguageProvider>
          <AuthProvider>
          
               <CartProvider>
                <FavoritesProvider>

            <App /> 
            </FavoritesProvider>
             </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </CurrencyProvider>
    
    </BrowserRouter>
  </StrictMode>,
)
