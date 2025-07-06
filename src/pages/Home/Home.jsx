import { useState } from 'react';
import Hero from '../../components/Hero/Hero';
import SearchSection from '../../components/SearchSection/SearchSection';
import ProductScroller from '../../components/ProductScroller/ProductScroller';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="home">
      <Hero />
      <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductScroller searchTerm={searchTerm} />
      <Contact />
    </div>
  );
};

export default Home;
