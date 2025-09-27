// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getAuth, signOut } from 'firebase/auth';
// import { auth } from '../firebase'; // Import auth from your setup

// // Icons: Using Unicode characters for simplicity, replace with your icon library (e.g., Lucide, Font Awesome)
// const HomeIcon = () => <span>🏠</span>;
// const ClubsIcon = () => <span>🌐</span>;
// const MyClubIcon = () => <span>⭐</span>;
// const CreateIcon = () => <span>➕</span>;
// const EventIcon = () => <span>🗓️</span>;
// const LogoutIcon = () => <span>➡️</span>;
// const MenuIcon = () => <span>☰</span>;

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // --- Handlers ---

//   // Handle user logout
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       console.log("User logged out successfully.");
//       // Redirect user to the landing page after logout
//       navigate('/');
//     } catch (error) {
//       console.error("Error during logout:", error);
//       // Optional: show a message box error to the user
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     // Uses the CSS classes defined in Dashboard.css
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
//       {/* Sidebar Header and Toggle Button */}
//       <div className="sidebar-header">
//         {/* The toggle button is styled to show only the icon when closed */}
//         <button onClick={toggleSidebar} className="sidebar-toggle">
//             <MenuIcon />
//         </button>
//       </div>

//       <ul className="nav-list">
//         {/* 1. HOME: Redirects back to the Student Dashboard root path */}
//         <li className="nav-item">
//           <Link to="/student/dashboard">
//             <HomeIcon />
//             {isOpen && <span>Home</span>}
//           </Link>
//         </li>
        
//         {/* 2. CLUBS: Main navigation link */}
//         <li className="nav-item">
//           <Link to="/clubs">
//             <ClubsIcon />
//             {isOpen && <span>Clubs</span>}
//           </Link>
//         </li>
        
//         {/* 3. MY CLUB: Dropdown Menu Example */}
//         <li className="nav-item">
//             <button className="nav-item-button" onClick={toggleDropdown}>
//                 <MyClubIcon />
//                 {isOpen && <span>My Clubs</span>}
//             </button>
//             <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
//                 <li className="nav-item">
//                     {/* Placeholder route: /student/my-club/dashboard */}
//                     <Link to="/student/my-club/dashboard">Dashboard</Link>
//                 </li>
//                 <li className="nav-item">
//                     {/* Placeholder route: /student/my-club/members */}
//                     <Link to="/student/my-club/members">Members</Link>
//                 </li>
//             </ul>
//         </li>
        
//         {/* 4. CREATE CLUB */}
//         <li className="nav-item">
//           {/* Placeholder route: /student/create-club */}
//           <Link to="/student/create-club">
//             <CreateIcon />
//             {isOpen && <span>Create Club</span>}
//           </Link>
//         </li>
        
//         {/* 5. CREATE EVENT */}
//         <li className="nav-item">
//           {/* Placeholder route: /student/create-event */}
//           <Link to="/student/create-event">
//             <EventIcon />
//             {isOpen && <span>Create Event</span>}
//           </Link>
//         </li>
//       </ul>

//       {/* Logout button area, typically pushed to the bottom */}
//       <div style={{ padding: '1rem' }}>
//         <button className="nav-item-button" onClick={handleLogout} style={{ justifyContent: 'center', backgroundColor: '#374151', borderRadius: '4px' }}>
//           <LogoutIcon />
//           {isOpen && <span>Logout</span>}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// // src/components/Sidebar.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
// import { auth, db } from '../firebase'; // Import auth and db

// // Icons: Using Unicode characters for simplicity
// const HomeIcon = () => <span>🏠</span>;
// const ClubsIcon = () => <span>🌐</span>;
// const MyClubIcon = () => <span>⭐</span>;
// const CreateIcon = () => <span>➕</span>;
// const EventIcon = () => <span>🗓️</span>;
// const LogoutIcon = () => <span>➡️</span>;
// const MenuIcon = () => <span>☰</span>;

// // 💡 CONFIGURATION: New collection for club membership
// const USER_CLUBS_COLLECTION = 'user_clubs';

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [joinedClubs, setJoinedClubs] = useState([]); // State to hold joined clubs
//   const [userId, setUserId] = useState(null);

//   // --- Firestore Listener for Joined Clubs ---
//   useEffect(() => {
//     // Get the current user ID
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//         setUserId(user ? user.uid : null);
//     });

//     // Set up the listener only if we have a user ID
//     let unsubscribeSnapshot = () => {};

//     if (userId) {
//       // Create a query to find all clubs where the current userId is a member
//       const clubsQuery = query(
//         collection(db, USER_CLUBS_COLLECTION),
//         where("memberId", "==", userId)
//       );

//       // Listen for real-time updates
//       unsubscribeSnapshot = onSnapshot(clubsQuery, (snapshot) => {
//         const clubs = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setJoinedClubs(clubs);
//       }, (error) => {
//         console.error("Error fetching joined clubs:", error);
//       });
//     }

//     // Clean up both listeners
//     return () => {
//         unsubscribeAuth();
//         unsubscribeSnapshot();
//     };
//   }, [userId]);


//   // --- Handlers ---
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/');
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
//       {/* Sidebar Header and Toggle Button */}
//       <div className="sidebar-header">
//         <button onClick={toggleSidebar} className="sidebar-toggle">
//             <MenuIcon />
//         </button>
//       </div>

//       <ul className="nav-list">
//         {/* 1. HOME */}
//         <li className="nav-item">
//           <Link to="/student/dashboard">
//             <HomeIcon />
//             {isOpen && <span>Home</span>}
//           </Link>
//         </li>
        
//         {/* 2. CLUBS */}
//         <li className="nav-item">
//           <Link to="/clubs">
//             <ClubsIcon />
//             {isOpen && <span>Clubs</span>}
//           </Link>
//         </li>
        
//         {/* 3. MY CLUB: Dropdown Menu Example */}
//         <li className="nav-item">
//             <button className="nav-item-button" onClick={toggleDropdown}>
//                 <MyClubIcon />
//                 {isOpen && <span>My Clubs ({joinedClubs.length})</span>}
//             </button>
//             <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
//                 {joinedClubs.length > 0 ? (
//                     joinedClubs.map(club => (
//                         <li key={club.id} className="nav-item">
//                             {/* Link to a specific club's page */}
//                             <Link to={`/clubs/${club.clubName}`}>{club.clubName}</Link>
//                         </li>
//                     ))
//                 ) : (
//                     <li className="nav-item" style={{ color: '#aaa', fontSize: '0.85rem', paddingLeft: '1.5rem' }}>
//                         No clubs joined yet.
//                     </li>
//                 )}
//             </ul>
//         </li>
        
//         {/* 4. CREATE CLUB */}
//         <li className="nav-item">
//           <Link to="/student/create-club">
//             <CreateIcon />
//             {isOpen && <span>Create Club</span>}
//           </Link>
//         </li>
        
//         {/* 5. CREATE EVENT */}
//         <li className="nav-item">
//           <Link to="/student/create-event">
//             <EventIcon />
//             {isOpen && <span>Create Event</span>}
//           </Link>
//         </li>
//       </ul>

//       {/* Logout button area */}
//       <div style={{ padding: '1rem' }}>
//         <button className="nav-item-button" onClick={handleLogout} style={{ justifyContent: 'center', backgroundColor: '#374151', borderRadius: '4px' }}>
//           <LogoutIcon />
//           {isOpen && <span>Logout</span>}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/Sidebar.jsx



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

// Icons: Using Unicode characters for simplicity
const HomeIcon = () => <span>🏠</span>;
const ClubsIcon = () => <span>🌐</span>;
const MyClubIcon = () => <span>⭐</span>;
const CreateIcon = () => <span>➕</span>;
const EventIcon = () => <span>🗓️</span>;
const LogoutIcon = () => <span>➡️</span>;
const MenuIcon = () => <span>☰</span>;
const AcceptIcon = () => <span>✅</span>; // Admin icon

// --- CONFIGURATION ---
const USER_CLUBS_COLLECTION = 'user_clubs';

const Sidebar = ({ isOpen, toggleSidebar, role = 'student' }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState([]); 
  const [userId, setUserId] = useState(null);

  // --- Firestore Listener for Joined Clubs ---
  useEffect(() => {
    // 1. Get the current user ID
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setUserId(user ? user.uid : null);
    });

    let unsubscribeSnapshot = () => {};

    // 2. Set up the club listener only if we have a user ID and the role is student
    if (userId && role === 'student') {
      const clubsQuery = query(
        collection(db, USER_CLUBS_COLLECTION),
        where("memberId", "==", userId)
      );

      // Listen for real-time updates
      unsubscribeSnapshot = onSnapshot(clubsQuery, (snapshot) => {
        const clubs = snapshot.docs.map(doc => ({
          id: doc.id,
          // clubName is explicitly stored in the document data
          clubName: doc.data().clubName, 
        }));
        setJoinedClubs(clubs);
      }, (error) => {
        console.error("Error fetching joined clubs:", error);
      });
    } else if (role === 'student' && !userId) {
        setJoinedClubs([]);
    }

    // Clean up both listeners
    return () => {
        unsubscribeAuth();
        unsubscribeSnapshot();
    };
  }, [userId, role]);


  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // --- Navigation Link Data (Based on Role) ---
  const adminNav = [
    { name: 'Home', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Clubs', path: '/clubs', icon: ClubsIcon }, 
    { name: 'Accept Club', path: '/admin/accept-club', icon: AcceptIcon },
    { name: 'Accept Event', path: '/admin/accept-event', icon: EventIcon },
  ];

  const studentNav = [
    { name: 'Home', path: '/student/dashboard', icon: HomeIcon },
    { name: 'Clubs', path: '/clubs', icon: ClubsIcon },
    // This item will be dynamically rendered as the list of joined clubs
    { name: 'My Clubs', isDropdown: true, icon: MyClubIcon }, 
    { name: 'Create Club', path: '/student/create-club', icon: CreateIcon },
    { name: 'Create Event', path: '/student/create-event', icon: EventIcon },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;


  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      {/* Sidebar Header and Toggle Button */}
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="sidebar-toggle">
            <MenuIcon />
        </button>
      </div>

      <ul className="nav-list">
        {navItems.map((item, index) => {
            // Dropdown Item Logic (only for student role: My Clubs)
            if (item.isDropdown && role === 'student') {
                return (
                    <li className="nav-item" key={index}>
                        <button className="nav-item-button" onClick={toggleDropdown}>
                            <item.icon />
                            {isOpen && <span>{item.name} ({joinedClubs.length})</span>}
                        </button>
                        <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                            {joinedClubs.length > 0 ? (
                                joinedClubs.map(club => (
                                    <li key={club.id} className="nav-item">
                                        {/* Link to club details page */}
                                        <Link to={`/clubs/${club.clubName.replace(/\s/g, '-')}`}>{club.clubName}</Link>
                                    </li>
                                ))
                            ) : (
                                <li className="nav-item" style={{ color: '#aaa', fontSize: '0.85rem', paddingLeft: '1.5rem' }}>
                                    No clubs joined yet.
                                </li>
                            )}
                        </ul>
                    </li>
                );
            }
            
            // Standard Link Item Logic
            return (
                <li className="nav-item" key={index}>
                    <Link to={item.path}>
                        <item.icon />
                        {isOpen && <span>{item.name}</span>}
                    </Link>
                </li>
            );
        })}
      </ul>

      {/* Logout button area */}
      <div style={{ padding: '1rem' }}>
        <button className="nav-item-button" onClick={handleLogout} style={{ justifyContent: 'center', backgroundColor: '#374151', borderRadius: '4px' }}>
          <LogoutIcon />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;