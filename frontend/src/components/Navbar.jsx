import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        ClubHub
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {/* Changed this link from Contact to Clubs */}
        <Link to="/clubs">Clubs</Link>
        <Link to="/about">About Us</Link>
        <Link to="/events">Events</Link>
      </div>
    </nav>
  );
};

export default Navbar;