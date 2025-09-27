import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    // Uses the new 'about-bg' class for the specific background image
    <div className="app-container about-bg">
      <Navbar /> 
      <main className="about-content-container">
        
        {/* Glassmorphism Card for content */}
        <div className="about-card">
          <h1 className="about-title">About ClubHub</h1>
          
          <section className="about-section">
            <h2 className="section-header">Our Vision</h2>
            <p>
              To be the central, seamless hub for all student club activities at VIT-AP, fostering a vibrant and connected campus life. We aim to empower students to easily discover, join, and manage diverse activities, transforming passive interest into active participation.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-header">Mission Statement</h2>
            <p>
              ClubHub simplifies the bureaucratic processes for club leaders (registration, event planning) and offers students a single window to explore every technical, cultural, and social organization on campus. Our mission is built on transparency, accessibility, and real-time information.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-header">Who We Are</h2>
            <div className="team-grid">
                <div className="team-member">
                    <h4>Student Developers</h4>
                    <p>Building and maintaining the platform with modern React/Firebase stack.</p>
                </div>
                <div className="team-member">
                    <h4>Admin Panel</h4>
                    <p>Managed by the admin@vitap.ac.in for club and event approvals.</p>
                </div>
            </div>
          </section>
          
          <div className="back-link-container" style={{ marginTop: '3rem' }}>
              <Link to="/" className="back-link" style={{ color: 'white' }}>
                  &larr; Back to Home
              </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
