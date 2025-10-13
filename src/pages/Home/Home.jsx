import Hero from '../../components/Hero/Hero';
import BestSellers from '../../components/BestSellers/BestSellers';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <BestSellers />
    </div>
  );
};

export default Home;
