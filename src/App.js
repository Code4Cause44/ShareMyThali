import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import ThemeToggle from './components/ThemeToggle';
import Partners from './components/Partners';

function Home() {
  return (
    <>
      <ThemeToggle />
      <Hero />
      <Features />
      <Testimonials />
      <Partners />
      <CallToAction />
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;