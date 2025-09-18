
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Categories from './components/Categories/Categories';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import CategoriesPage from './pages/Categories/Categories';
import AllCategoriesPage from './pages/AllCategories/AllCategories';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginModel from './pages/LoginModal/LoginModal';
import Cart from './pages/Cart/Cart';
import AddCart from './components/Cart/AddCart';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Categories />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/allcategories" element={<AllCategoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/loginmodel" element={<LoginModel />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addcart" element={<AddCart />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;