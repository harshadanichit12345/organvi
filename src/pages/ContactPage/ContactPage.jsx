import React from 'react';
import Contact from '../../components/Contact/Contact';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-description">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>
      <Contact />
    </div>
  );
};

export default ContactPage;