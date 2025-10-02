
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import GreenBar from './components/GreenBar/GreenBar';
import Navbar from './components/Navbar/Navbar';
import Categories from './components/Categories/Categories';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import CategoriesPage from './pages/Categories/Categories';
import AllCategoriesPage from './pages/AllCategories/AllCategories';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginModel from './pages/LoginModal/LoginModal';
import Cart from './pages/Cart/Cart';
import AddCart from './components/Cart/AddCart';
import Pulses from './components/Pulses/Pulses';
import DryFruits from './components/Dry_Fruits/DryFruits';
import Sweetener from './components/Sweetner/Sweetner';
import Spices from './components/Spices/Spices';
import Likeproduct from './components/Like/Likeproduct';
import SearchPage from './pages/Search/Search';
import Account from './components/Account/Account';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <GreenBar />
          <Navbar />
          <Categories />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/allcategories" element={<AllCategoriesPage />} />
              <Route path="/pulses" element={<Pulses />} />
              <Route path="/dryfruits" element={<DryFruits />} />
              <Route path="/sweetener" element={<Sweetener />} />
              <Route path="/spices" element={<Spices />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/loginmodel" element={<LoginModel />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/addcart" element={<AddCart />} />
              <Route path="/like" element={<Likeproduct />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;