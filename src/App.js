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
import DonateFood from './components/DonateFood';
import RequestFood from './components/RequestFood';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MyDonations from './components/MyDonations';
import MyRequests from './components/MyRequests';

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
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/donate"
                        element={
                            <ProtectedRoute allowedRoles={['donor', 'admin']}>
                                <DonateFood />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/request"
                        element={
                            <ProtectedRoute allowedRoles={['organization', 'admin']}>
                                <RequestFood />
                            </ProtectedRoute>
                        }
                    />
                     <Route
                        path="/my-donations"
                        element={
                            <ProtectedRoute allowedRoles={['donor', 'admin']}>
                                <MyDonations />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-requests"
                        element={
                            <ProtectedRoute allowedRoles={['organization', 'admin']}>
                                <MyRequests />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;