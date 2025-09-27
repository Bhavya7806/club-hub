// src/pages/EventsInfoPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';

// Helper function to assign specific colors to posters (retained for title colors)
const getPosterColor = (id) => {
    switch(id) {
        case 1: return '#ef4444'; // Red (VGLAM Western)
        case 2: return '#3b82f6'; // Blue (VGiggle Comedy)
        case 3: return '#10b981'; // Green (Academic Workshop)
        case 4: return '#8b5cf6'; // Violet (Tech Challenge)
        default: return '#6b7280'; // Gray
    }
}

// Event poster URLs provided by the user
const EVENT_POSTERS = [
    { id: 1, url: 'https://vitopia.vitap.ac.in/_next/image?url=https%3A%2F%2Funiversitywebsitbucket.s3.ap-south-1.amazonaws.com%2Fvitopia%2Fprime%2BEvents%2Fdesign-VGLAM-WESTERN-A4.avif&w=3840&q=75', title: 'VGLAM Western' },
    { id: 2, url: 'https://vitopia.vitap.ac.in/_next/image?url=https%3A%2F%2Funiversitywebsitbucket.s3.ap-south-1.amazonaws.com%2Fvitopia%2Fprime%2BEvents%2Fvgiggle%2Bstand%2Bup%2Bcomedy%2BA4%2Bwebsite.avif&w=3840&q=75', title: 'VGiggle Comedy' },
    { id: 3, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7AlcbNA4jjpIdq_IQ8AJjINhfeOVEoxg9JltktnWVoiZvIV6NOp_mCWeqiKy-X1rlEE&usqp=CAU', title: 'Academic Workshop' },
    { id: 4, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKYU3oDSq2c_oT8H-F31lpL0CT_isMtQwfKw&s', title: 'Tech Challenge' },
];

const EventsInfoPage = () => {
  return (
    // 💡 Applied class 'events-bg' to the container for the global gradient
    <div className="app-container events-bg"> 
      <Navbar /> 
      <main className="page-content">
        <h1 className="page-title">Upcoming Club Events</h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#4b5563' }}>
            Check out the latest event posters from clubs across the campus!
        </p>
        
        <div className="events-poster-grid">
          {EVENT_POSTERS.map(poster => {
            const cardColor = getPosterColor(poster.id);
            return (
                <div 
                  key={poster.id} 
                  className="poster-card"
                  // Removed inline background style, added color to title
                >
                  <div className="poster-image-wrapper">
                    <img 
                      src={poster.url} 
                      alt={poster.title} 
                      className="poster-image"
                      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                    />
                  </div>
                  {/* Title uses the color for emphasis */}
                  <p className="poster-title-overlay" style={{ color: cardColor }}>
                    {poster.title}
                  </p>
                </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default EventsInfoPage;