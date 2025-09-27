// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import { Link } from 'react-router-dom';

// // Utility function to determine an icon/color based on keywords
// const getClubDesign = (name) => {
//     name = name.toLowerCase();
//     let icon = '💡'; // Default Icon
//     let color = '#0d6efd'; // Default Blue

//     if (name.includes('tech') || name.includes('computing') || name.includes('machine learning') || name.includes('cloud')) {
//         icon = '💻';
//         color = '#f59e0b'; // Amber/Orange
//     } else if (name.includes('literary') || name.includes('debate') || name.includes('nerd')) {
//         icon = '📚';
//         color = '#10b981'; // Emerald/Green
//     } else if (name.includes('photo') || name.includes('visual') || name.includes('cinematography')) {
//         icon = '📸';
//         color = '#ef4444'; // Red
//     } else if (name.includes('sports') || name.includes('fitness')) {
//         icon = '⚽';
//         color = '#3b82f6'; // Light Blue
//     } else if (name.includes('music')) {
//         icon = '🎧';
//         color = '#8b5cf6'; // Violet
//     } else if (name.includes('open source') || name.includes('ieee') || name.includes('hacking') || name.includes('computer')) {
//         icon = '🛠️';
//         color = '#6b7280'; // Gray/Tech
//     }

//     return { icon, color };
// };

// const ClubsPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Dummy data for clubs, updated with information from VIT-AP website
//   const allClubs = [
//     { name: 'Tech Club', description: 'Exploring the latest in technology and innovation.' },
//     { name: 'Literary Society', description: 'For the love of books, poetry, and prose.' },
//     { name: 'Photography Club', description: 'Capturing moments, telling stories through lenses.' },
//     { name: 'Sports Club', description: 'Promoting fitness, teamwork, and sportsmanship.' },
//     { name: 'Music Club', description: 'For all the audiophiles and musicians on campus.' },
//     { name: 'Debate Union', description: 'Engage in stimulating discussions and sharpen your arguments.' },
//     { name: 'ACM STUDENT CHAPTER', description: 'Official student chapter focused on computing and technology.' },
//     { name: 'NextGen Cloud Club', description: 'Focusing on cloud computing technologies and services.' },
//     { name: 'GEEKS FOR GEEKS VIT-AP STUDENT CHAPTER', description: 'Learning and practicing competitive programming and computer science skills.' },
//     { name: 'SEDS Aurora', description: 'Students for the Exploration and Development of Space, astronomy, and rocketry.' },
//     { name: 'Uddeshya Club', description: 'A club focusing on leadership development and social good initiatives.' },
//     { name: 'Photon Club', description: 'Dedicated to photography, cinematography, and visual storytelling.' },
//     { name: 'WiOS - Women in Open Source', description: 'Empowering women to contribute to open-source software projects.' },
//     { name: 'Machine Learning Club (MLC)', description: 'Diving into artificial intelligence, data science, and deep learning.' },
//     { name: 'Be A Nerd', description: 'A club for general intellectual and "nerdy" interests and hobbies.' },
//     { name: 'Innovators Quest Club', description: 'Driving innovation and entrepreneurship on campus.' },
//     { name: 'Null Chapter', description: 'Focusing on ethical hacking, cybersecurity, and digital defense.' },
//     { name: 'Open Source Community: VIT-AP', description: 'Promoting collaboration and development in open-source software.' },
//     { name: 'Computer Society of India', description: 'A professional body for IT students and professionals.' },
//     { name: 'VIT-AP IEEE Student Branch', description: 'The student chapter of the Institute of Electrical and Electronics Engineers.' },
//   ];

//   // Filter clubs based on search term
//   const filteredClubs = allClubs.filter(club =>
//     club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     club.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="page-wrapper">
//       <Navbar theme="light" />
//       <main className="page-content">
//         <h1 className="page-title">University Clubs</h1>
        
//         {/* Search Bar & Stats */}
//         <div className="club-header-controls">
//             <input 
//                 type="text" 
//                 placeholder="Search clubs by name or activity..." 
//                 className="club-search-input"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="club-stats">
//                 Showing **{filteredClubs.length}** of **{allClubs.length}** clubs.
//             </div>
//         </div>

//         <div className="clubs-grid">
//           {filteredClubs.map((club, index) => {
//             const { icon, color } = getClubDesign(club.name);
//             return (
//               <div key={index} className="club-card" style={{ borderLeft: `5px solid ${color}` }}>
                
//                 <div className="club-card-header">
//                     <span className="club-icon" style={{ backgroundColor: color }}>{icon}</span>
//                     <h3 className="club-card-name">{club.name}</h3>
//                 </div>

//                 <p className="club-card-description">{club.description}</p>
                
//                 <div className="club-card-footer">
//                     <button className="btn-join" style={{ backgroundColor: color }}>
//                         Join / View Details
//                     </button>
//                     {/* Placeholder for future detailed view link */}
//                     <Link to={`/clubs/${club.name.replace(/\s/g, '-')}`} className="btn-link">
//                         Learn More
//                     </Link>
//                 </div>

//               </div>
//             );
//           })}
          
//           {/* Message if no clubs are found */}
//           {filteredClubs.length === 0 && (
//               <div className="no-clubs-found">
//                   No clubs match your search. Try broadening your query!
//               </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ClubsPage;
// src/pages/ClubsPage.jsx

// src/pages/ClubsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, doc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

// CONFIGURATION: New collection for club membership
const USER_CLUBS_COLLECTION = 'user_clubs';

// Utility function to determine an icon/color based on keywords (Remains the same)
const getClubDesign = (name) => {
    name = name.toLowerCase();
    let icon = '💡'; 
    let color = '#0d6efd'; 

    if (name.includes('tech') || name.includes('computing') || name.includes('machine learning') || name.includes('cloud')) {
        icon = '💻';
        color = '#f59e0b'; 
    } else if (name.includes('literary') || name.includes('debate') || name.includes('nerd')) {
        icon = '📚';
        color = '#10b981'; 
    } else if (name.includes('photo') || name.includes('visual') || name.includes('cinematography')) {
        icon = '📸';
        color = '#ef4444'; 
    } else if (name.includes('sports') || name.includes('fitness')) {
        icon = '⚽';
        color = '#3b82f6'; 
    } else if (name.includes('music')) {
        icon = '🎧';
        color = '#8b5cf6'; 
    } else if (name.includes('open source') || name.includes('ieee') || name.includes('hacking') || name.includes('computer')) {
        icon = '🛠️';
        color = '#6b7280'; 
    }

    return { icon, color };
};

const ClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [userId, setUserId] = useState(null);
  const [joinedClubNames, setJoinedClubNames] = useState({}); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // --- Authentication and Joined Clubs Fetch ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot = () => {};

    if (userId) {
        const clubsQuery = query(
            collection(db, USER_CLUBS_COLLECTION),
            where("memberId", "==", userId)
        );

        unsubscribeSnapshot = onSnapshot(clubsQuery, (snapshot) => {
            const joinedClubs = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                joinedClubs[data.clubName] = doc.id; 
            });
            setJoinedClubNames(joinedClubs);
        }, (error) => {
            console.error("Error fetching joined clubs status:", error);
        });
    } else {
        setJoinedClubNames({}); 
    }

    return () => unsubscribeSnapshot();
  }, [userId]);


  // --- Club Joining/Leaving Handler ---
  const handleJoinClub = async (clubName, isJoined) => {
    if (!userId) {
        // Use custom message display instead of alert in production apps
        console.error("Please log in to join a club.");
        return;
    }
    
    try {
        if (isJoined) {
            // LEAVE CLUB: Delete the membership document
            const docId = joinedClubNames[clubName];
            if (docId) { // Safety check
                 await deleteDoc(doc(db, USER_CLUBS_COLLECTION, docId));
                 console.log(`Left club: ${clubName}, Doc ID: ${docId}`);
            }
        } else {
            // JOIN CLUB: Create a new membership document
            await addDoc(collection(db, USER_CLUBS_COLLECTION), {
                memberId: userId,
                clubName: clubName,
                joinedAt: new Date(),
            });
            console.log(`Joined club: ${clubName}`);
        }
    } catch (error) {
        console.error(`Failed to modify club membership for ${clubName}:`, error);
        // Display generic error to user
        console.warn("Operation failed. This is likely a Security Rules error.");
    }
  };


  // Dummy data for clubs (Remains the same)
  const allClubs = [
    { name: 'Tech Club', description: 'Exploring the latest in technology and innovation.' },
    { name: 'Literary Society', description: 'For the love of books, poetry, and prose.' },
    { name: 'Photography Club', description: 'Capturing moments, telling stories through lenses.' },
    { name: 'Sports Club', description: 'Promoting fitness, teamwork, and sportsmanship.' },
    { name: 'Music Club', description: 'For all the audiophiles and musicians on campus.' },
    { name: 'Debate Union', description: 'Engage in stimulating discussions and sharpen your arguments.' },
    { name: 'ACM STUDENT CHAPTER', description: 'Official student chapter focused on computing and technology.' },
    { name: 'NextGen Cloud Club', description: 'Focusing on cloud computing technologies and services.' },
    { name: 'GEEKS FOR GEEKS VIT-AP STUDENT CHAPTER', description: 'Learning and practicing competitive programming and computer science skills.' },
    { name: 'SEDS Aurora', description: 'Students for the Exploration and Development of Space, astronomy, and rocketry.' },
    { name: 'Uddeshya Club', description: 'A club focusing on leadership development and social good initiatives.' },
    { name: 'Photon Club', description: 'Dedicated to photography, cinematography, and visual storytelling.' },
    { name: 'WiOS - Women in Open Source', description: 'Empowering women to contribute to open-source software projects.' },
    { name: 'Machine Learning Club (MLC)', description: 'Diving into artificial intelligence, data science, and deep learning.' },
    { name: 'Be A Nerd', description: 'A club for general intellectual and "nerdy" interests and hobbies.' },
    { name: 'Innovators Quest Club', description: 'Driving innovation and entrepreneurship on campus.' },
    { name: 'Null Chapter', description: 'Focusing on ethical hacking, cybersecurity, and digital defense.' },
    { name: 'Open Source Community: VIT-AP', description: 'Promoting collaboration and development in open-source software.' },
    { name: 'Computer Society of India', description: 'A professional body for IT students and professionals.' },
    { name: 'VIT-AP IEEE Student Branch', description: 'The student chapter of the Institute of Electrical and Electronics Engineers.' },
  ];

  // Filter clubs based on search term
  const filteredClubs = allClubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container"> 
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <h1 className="page-title">University Clubs</h1>
        
        {/* Search Bar & Stats */}
        <div className="club-header-controls">
            <input 
                type="text" 
                placeholder="Search clubs by name or activity..." 
                className="club-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="club-stats">
                Showing **{filteredClubs.length}** of **{allClubs.length}** clubs.
            </div>
        </div>

        <div className="clubs-grid">
          {filteredClubs.map((club, index) => {
            const { icon, color } = getClubDesign(club.name);
            const isJoined = !!joinedClubNames[club.name];
            
            return (
              <div key={index} className="club-card" style={{ borderLeft: `5px solid ${color}` }}>
                
                <div className="club-card-header">
                    <span className="club-icon" style={{ backgroundColor: color, color: 'white' }}>{icon}</span>
                    <h3 className="club-card-name">{club.name}</h3>
                </div>

                <p className="club-card-description">{club.description}</p>
                
                <div className="club-card-footer">
                    <button 
                        className="btn-join" 
                        onClick={() => handleJoinClub(club.name, isJoined)}
                        style={{ backgroundColor: isJoined ? '#ef4444' : color }}
                        disabled={!userId}
                    >
                        {isJoined ? 'Leave Club' : 'Join Club'}
                    </button>
                    {/* Placeholder for future detailed view link */}
                    <Link to={`/clubs/${club.name.replace(/\s/g, '-')}`} className="btn-link">
                        View Details
                    </Link>
                </div>

              </div>
            );
          })}
          
          {/* Message if no clubs are found */}
          {filteredClubs.length === 0 && (
              <div className="no-clubs-found">
                  No clubs match your search. Try broadening your query!
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClubsPage;
// src/pages/ClubsPage.jsx


