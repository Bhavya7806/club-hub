import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; 

// Import all your page components
import LandingPage from './pages/LandingPage';
import ClubsPage from './pages/ClubsPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import CreateClubPage from './pages/CreateClubPage'; 
import CreateEventPage from './pages/CreateEventPage'; 
import AboutUsPage from './pages/AboutUsPage'; 
import AdminDashboard from './pages/AdminDashboard'; 
import AcceptClubPage from './pages/AcceptClubPage'; 
import AcceptEventPage from './pages/AcceptEventPage';
// CRITICAL FIX: Import UserProvider for global state management
import { UserProvider } from './context/UserContext'; 


// Wrapper to access context logic (like useLocation)
const AppContent = () => {
  const location = useLocation();

  // Logic for full-screen background: applies to Landing, Auth, and Creation pages
  const showBackground = 
    location.pathname === '/' || 
    location.pathname.startsWith('/login') ||
    location.pathname === '/student/create-club' ||
    location.pathname === '/student/create-event' ||
    location.pathname === '/admin/accept-club' || 
    location.pathname === '/admin/accept-event'; 

  return (
    <div className={`app-container ${showBackground ? 'with-background' : ''}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} /> 
        
        {/* Auth Route */}
        <Route path="/login/:role" element={<AuthPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 

        {/* CLUB MANAGEMENT ROUTES (Students) */}
        {/* Path: /student/create-club */}
        <Route path="/student/create-club" element={<CreateClubPage />} />
        {/* Path: /student/create-event */}
        <Route path="/student/create-event" element={<CreateEventPage />} />
        
        {/* ADMIN APPROVAL ROUTES (Review Pages) */}
        {/* Path: /admin/accept-club */}
        <Route path="/admin/accept-club" element={<AcceptClubPage />} /> 
        {/* Path: /admin/accept-event: This MUST render AcceptEventPage */}
        <Route path="/admin/accept-event" element={<AcceptEventPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    // Assumes the router is wrapped in index.js/main.jsx
    <UserProvider> 
      <AppContent />
    </UserProvider>
  );
}

export default App;
