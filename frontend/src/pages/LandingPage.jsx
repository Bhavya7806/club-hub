import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main className="landing-page">
        <div className="welcome-text">
          <h1>Welcome to ClubHub</h1>
          <p>Your one-stop platform for managing and discovering university clubs and events.</p>
        </div>

        <div className="login-modal">
          <h3>Continue as</h3>
          <div className="button-container">
            {/* This link passes 'admin' as the role */}
            <Link to="/login/admin" className="btn btn-admin">
              Admin
            </Link>
            {/* This link passes 'student' as the role */}
            <Link to="/login/student" className="btn btn-student">
              Student
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;