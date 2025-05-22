import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import UpcomingSlider from './components/UpcomingSlider';
import PopularProducts from './sections/PopularProducts';
import Footer from './components/Footer';
import UpcomingProducts from './sections/UpcomingProducts';
import LoginRegister from './pages/LoginRegister';
import RegisterForm from './pages/RegisterForm';
import PrivateRoute from './components/PrivateRoute';
import AccountPage from './pages/AccountPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';






function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Navbar />
      <CategoryBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <UpcomingSlider />
              <PopularProducts />
              <UpcomingProducts />
            </>
          }
        />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/category/:categoria" element={<CategoryPage />} />
        <Route path="/search/:term" element={<SearchPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />




      </Routes>
      <Footer />
    </div>
  );
}

export default App;

