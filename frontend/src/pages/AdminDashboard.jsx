import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase'; 
import '../Dashboard.css';

// AdminDashboard component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('Director'); // Set professional default name
  const [pendingClubs, setPendingClubs] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // 1. Authentication and Authorization Check
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        // Fetch Admin Name from profile
        const userDocRef = doc(db, "user_profiles", user.uid); 
        const userDoc = await getDoc(userDocRef); 
        if (userDoc.exists()) {
          setAdminName(userDoc.data().username || user.email);
        }

        // 2. Setup Firestore Listeners for Pending Requests
        
        // Listener for Club Requests
        const qClubs = query(
          collection(db, 'clubRequests'), 
          where('status', '==', 'Pending Admin Review')
        );
        const unsubscribeClubs = onSnapshot(qClubs, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPendingClubs(requests);
        }, (err) => {
          console.error("Firestore Club Listener Error:", err);
          setError("Failed to load club requests.");
        });

        // Listener for Event Requests
        const qEvents = query(
          collection(db, 'eventRequests'), 
          where('status', '==', 'Pending Admin Review')
        );
        const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPendingEvents(requests);
        }, (err) => {
          console.error("Firestore Event Listener Error:", err);
          setError("Failed to load event requests.");
        });

        // Cleanup function
        return () => {
          unsubscribeClubs();
          unsubscribeEvents();
        };

      } else {
        // If not logged in, redirect to login page
        navigate('/login/admin');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);


  return (
    // Uses the dedicated 'admin-mode' class for professional styling (defined in Dashboard.css)
    <div className="dashboard-container admin-mode">
      <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          role="admin" 
      />
      <main className="main-content">
        
        <div className="dashboard-header-card">
            <h1 className="main-title">Welcome, {adminName}!</h1>
            <p className="subtitle">This is the Admin Control Panel. You can manage club and event approvals here.</p>
        </div>

        {error && <div className="error-message" style={{ color: '#dc3545', padding: '1rem', background: '#fff3f4', border: '1px solid #f5c6cb' }}>{error}</div>}

        {/* Admin-Specific Stats and Management Links */}
        <div className="dashboard-grid">
            <div className="stat-card primary">
                <h2>Pending Club Requests</h2>
                <p>{pendingClubs.length}</p>
            </div>
            <div className="stat-card secondary">
                <h2>Pending Event Requests</h2>
                <p>{pendingEvents.length}</p>
            </div>
            <div className="stat-card tertiary">
                <h2>Total Users</h2>
                <p>—</p>
            </div>
        </div>
        
        <h2 className="section-title">Awaiting Club Approvals ({pendingClubs.length})</h2>
        <div className="activity-list">
             {pendingClubs.length > 0 ? (
                 pendingClubs.map(club => (
                    <div key={club.id} className="activity-item">
                        <p><strong>Club:</strong> {club.clubName}</p>
                        <p><strong>Type:</strong> {club.clubType}</p>
                        {/* Link button to the dedicated acceptance page */}
                        <button 
                          className="btn btn-admin"
                          onClick={() => navigate('/admin/accept-club')}
                        >
                          Review
                        </button>
                    </div>
                 ))
             ) : (
                 <p className="no-pending-requests">No pending club requests at this time. 🎉</p>
             )}
        </div>
        
        <h2 className="section-title" style={{ marginTop: '2rem' }}>Awaiting Event Approvals ({pendingEvents.length})</h2>
        <div className="activity-list">
             {pendingEvents.length > 0 ? (
                 pendingEvents.map(event => (
                    <div key={event.id} className="activity-item">
                        <p><strong>Event:</strong> {event.name}</p>
                        <p><strong>Club:</strong> {event.club}</p>
                        {/* Link button to the dedicated acceptance page */}
                        <button 
                          className="btn btn-admin"
                          onClick={() => navigate('/admin/accept-event')}
                        >
                          Review
                        </button>
                    </div>
                 ))
             ) : (
                 <p className="no-pending-requests">No pending event requests.</p>
             )}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
