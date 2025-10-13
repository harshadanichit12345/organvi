import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Shield, Truck, Heart, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import './About.css';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productionSteps = [
    {
      step: 1,
      title: "Ploughing",
      description: "Preparing the soil for sowing",
      icon: "🌾"
    },
    {
      step: 2,
      title: "Sowing",
      description: "Planting seeds in nutrient-rich soil",
      icon: "🌱"
    },
    {
      step: 3,
      title: "Adding Nutrients",
      description: "Fertilizing naturally to enrich soil",
      icon: "🌿"
    },
    {
      step: 4,
      title: "Irrigation",
      description: "Watering plants efficiently",
      icon: "💧"
    },
    {
      step: 5,
      title: "Protecting Plants",
      description: "Using natural methods to protect crops",
      icon: "🛡️"
    },
    {
      step: 6,
      title: "Harvesting",
      description: "Collecting crops at peak freshness",
      icon: "🌾"
    },
    {
      step: 7,
      title: "Storage",
      description: "Proper storage to maintain quality before packaging",
      icon: "📦"
    }
  ];

  const benefits = [
    "Conserves the environment & prevents pollution",
    "Keeps the land healthy and replenished",
    "Reduces human and animal health hazards",
    "Improves soil fertility and water quality",
    "Supports rural employment",
    "Reduces production cost and maintains sustainable production"
  ];

  return (
    <div className="about-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">-</span>
          <span className="breadcrumb-current">About Us</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Organvi – Eat Right, Live Right</h1>
            <p className="hero-description">
              Organvi is the fastest-growing company engaged in Farming, Producing, Processing, and Packing of Organic products. 
              At Organvi, foods are minimally processed without artificial ingredients or synthetic preservatives to maintain 
              the integrity of the organic products that begin on our farms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="mission-title">Mission</h2>
              <p className="mission-description">
                To help people live a better, healthier, and wholesome life by providing them with 100% certified, 
                authentic organic food that nourishes both body and soul.
              </p>
            </div>
            <div className="mission-visual">
              <div className="target-icon">
                <div className="target-circle outer"></div>
                <div className="target-circle middle"></div>
                <div className="target-circle inner"></div>
                <div className="target-arrow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-container">
          <div className="vision-content">
            <div className="vision-visual">
              <div className="binoculars-icon">
                <div className="binoculars-body"></div>
                <div className="binoculars-lens left"></div>
                <div className="binoculars-lens right"></div>
                <div className="binoculars-strap"></div>
              </div>
            </div>
            <div className="vision-text">
              <h2 className="vision-title">Vision</h2>
              <p className="vision-description">
                To be the leading brand of organic food in India. To give back to the environment and advance on a path to sustainability. 
                To make consumers aware of the benefits of organic food by giving them healthy choices of eating. To create a big movement 
                that would lead people to switch to organic food and take-up a healthier lifestyle just like it used to be hundreds of years 
                ago when pesticides were not introduced and everything we ate was natural and chemical-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <div className="journey-container">
          <h2 className="journey-title">Journey from Farm to Plate</h2>
          <div className="journey-steps">
            <div className="journey-step">
              <div className="step-icon farm-icon">
                <div className="farm-field"></div>
                <div className="farm-plants"></div>
                <div className="farm-data"></div>
              </div>
              <h3 className="step-title">Farm</h3>
            </div>
            <div className="journey-arrow">
              <div className="arrow-curve"></div>
            </div>
            <div className="journey-step">
              <div className="step-icon factory-icon">
                <div className="factory-building"></div>
                <div className="factory-stacks"></div>
              </div>
              <h3 className="step-title">Hygienic Factory</h3>
            </div>
            <div className="journey-arrow">
              <div className="arrow-curve"></div>
            </div>
            <div className="journey-step">
              <div className="step-icon kitchen-icon">
                <div className="kitchen-pan"></div>
                <div className="kitchen-food"></div>
                <div className="kitchen-steam"></div>
              </div>
              <h3 className="step-title">Your Kitchen</h3>
            </div>
          </div>
        </div>
      </section>

      {/* About Organvi Section */}
      <section className="about-organvi-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About Organvi</h2>
              <p className="about-description">
                Started in 2019 and officially registered in 2021 as Organvi Agro Industries Pvt. Ltd., 
                we are engaged in farming, producing, processing, and packing of organic products. 
                Our focus is on minimally processed foods with no synthetic preservatives, ensuring 
                the natural integrity of our organic products.
              </p>
              <div className="company-highlights">
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Started in 2019</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Registered in 2021</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>100% Organic Products</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={20} />
                  <span>Minimally Processed Foods</span>
                </div>
              </div>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2019</div>
                <div className="timeline-content">
                  <h4>Company Founded</h4>
                  <p>Started our journey in organic farming</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h4>Official Registration</h4>
                  <p>Registered as Organvi Agro Industries Pvt. Ltd.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2025</div>
                <div className="timeline-content">
                  <h4>Growing Strong</h4>
                  <p>Continuing to expand our organic product range</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Farming Section */}
      <section className="sustainable-farming-section">
        <div className="container">
          <h2 className="section-title">What is Sustainable Farming?</h2>
          <p className="sustainable-description">
            Sustainable farming practices that sustain farmers, resources, and communities. 
            It's environmentally sound, profitable, and good for communities, integrating 
            modern technologies with best practices of the past.
          </p>
          <div className="sustainable-benefits">
            <h3>Why Choose Sustainable Farming?</h3>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <CheckCircle size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Section */}
      <section className="production-process-section">
        <div className="container">
          <h2 className="section-title">From Farm to Table – Our Production Process</h2>
          <p className="process-description">
            Our 7-step agricultural process ensures the highest quality organic products 
            from seed to your table.
          </p>
          <div className="production-steps">
            {productionSteps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < productionSteps.length - 1 && (
                  <div className="step-arrow">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Organic Excellence?</h2>
            <p>Join us in our mission to provide pure, natural, and chemical-free organic products.</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-btn primary">Explore Products</Link>
              <Link to="/contact" className="cta-btn secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
