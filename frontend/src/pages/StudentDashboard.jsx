import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase'; 
import '../Dashboard.css';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [userName, setUserName] = useState('Student'); 
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    let unsubscribeProfile = () => {}; // Initialize placeholder for Firestore cleanup

    // 1. Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up the previous profile listener before setting a new one
      unsubscribeProfile(); 

      if (user) {
        // 2. User is signed in, set up REAL-TIME listener for profile changes
        const userDocRef = doc(db, 'user_profiles', user.uid);
        
        // FIX: Use onSnapshot for real-time updates and assign cleanup function
        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserProfile(data); // Save the whole profile
                setUserName(data.username || user.email.split('@')[0]);
            } else {
                console.warn("User profile document missing.");
                setUserProfile(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching user document in real-time:", error);
            setIsLoading(false);
        });

      } else {
        // User logged out
        setUserName('Guest');
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    // Final cleanup: Run both auth and the last profile listener when the component unmounts
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const welcomeMessage = isLoading ? 'Loading...' : `Welcome, ${userName}!`;
  
  // Determine if the user is a president
  // Note: The logic for 'presidentOf' assignment must be correct in AcceptClubPage.jsx
  const isPresident = userProfile?.presidentOf && userProfile.presidentOf !== 'NO_CLUB_ASSIGNED';

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="student" />
      <main className="main-content">
        
        <div className="dashboard-header-card">
            <h1 className="main-title">{welcomeMessage}</h1>
            <p className="subtitle">Manage your club activities and stay updated.</p>
        </div>

        <div className="dashboard-grid">
            
            {/* --- NEW: PRESIDENT STATUS CARD --- */}
            {isPresident && (
                <div className="stat-card president-status">
                    <h2>Leadership Role</h2>
                    <p style={{color: '#0d6efd', fontSize: '2rem'}}>President</p>
                    <p style={{fontSize: '1rem', color: '#4b5563'}}>Club: <strong>{userProfile.presidentOf}</strong></p>
                </div>
            )}
            {/* --- END NEW CARD --- */}

            <div className="stat-card primary">
                <h2>Total Clubs</h2>
                <p>15 Active</p>
            </div>
            <div className="stat-card secondary">
                <h2>My Events</h2>
                <p>3 Upcoming</p>
            </div>
            <div className="stat-card tertiary">
                <h2>Club Status</h2>
                <p>—</p>
            </div>
        </div>

        <div className="recent-activity">
             <h2 className="section-title">Recent Activity</h2>
             <ul className="activity-list">
                <li>Your club application was submitted successfully.</li>
                <li>You joined the 'Tech Innovators' club.</li>
                <li>New event: Hackathon signup is open!</li>
             </ul>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
