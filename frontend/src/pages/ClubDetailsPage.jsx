// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; 

// // Dummy data for demonstration purposes
// const DUMMY_ANNOUNCEMENTS = [
//     { id: 1, title: "Next General Body Meeting", date: "Sept 30, 2025", content: "Mandatory attendance for all members to discuss the upcoming tech fest." },
//     { id: 2, title: "New Project Team Formation", date: "Sept 28, 2025", content: "Looking for enthusiastic members for the Web 3.0 development project." },
// ];

// const DUMMY_EVENTS = [
//     { id: 1, title: "Annual Hackathon 2025", date: "Oct 15, 2025", location: "Auditorium A", status: "Open" },
//     { id: 2, title: "Python Basics Workshop", date: "Oct 5, 2025", location: "Lab 305", status: "Full" },
// ];

// const ClubDetailsPage = () => {
//     // Get the club name from the URL parameter (e.g., from /clubs/Tech-Club)
//     const { clubNameParam } = useParams();
//     // Convert URL param (e.g., "Tech-Club") back to display name ("Tech Club")
//     const clubName = clubNameParam ? clubNameParam.replace(/-/g, ' ') : 'Club Details';

//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//     const [view, setView] = useState('announcements'); // 'announcements' or 'events'

//     return (
//         <div className="dashboard-container">
//             <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
//             <main className="main-content">
//                 <div className="page-content" style={{ maxWidth: '100%', padding: '2rem' }}>
                    
//                     <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '1rem', borderBottom: '3px solid #0d6efd' }}>
//                         {clubName}
//                     </h1>
//                     <p style={{ margin: '0 0 2rem 0', color: '#6b7280' }}>
//                         Welcome to the official page for the {clubName}. Find the latest updates below.
//                     </p>

//                     {/* Navigation Tabs */}
//                     <div className="flex-tabs">
//                         <button 
//                             className={`tab-button ${view === 'announcements' ? 'active' : ''}`}
//                             onClick={() => setView('announcements')}
//                         >
//                             Announcements
//                         </button>
//                         <button 
//                             className={`tab-button ${view === 'events' ? 'active' : ''}`}
//                             onClick={() => setView('events')}
//                         >
//                             Upcoming Events
//                         </button>
//                     </div>

//                     {/* Content Area */}
//                     <div className="content-area-club">
//                         {view === 'announcements' && (
//                             <div className="announcements-section">
//                                 {DUMMY_ANNOUNCEMENTS.map(announcement => (
//                                     <div key={announcement.id} className="card-item">
//                                         <h3 className="item-title">{announcement.title}</h3>
//                                         <p className="item-meta">Posted: {announcement.date}</p>
//                                         <p className="item-content">{announcement.content}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {view === 'events' && (
//                             <div className="events-section">
//                                 {DUMMY_EVENTS.map(event => (
//                                     <div key={event.id} className="card-item event-card">
//                                         <h3 className="item-title">{event.title}</h3>
//                                         <div className="event-info">
//                                             <p>🗓️ {event.date}</p>
//                                             <p>📍 {event.location}</p>
//                                             <span className={`event-status status-${event.status.toLowerCase()}`}>{event.status}</span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default ClubDetailsPage;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

// Dummy data for announcements and events
const DUMMY_ANNOUNCEMENTS = [
    { id: 1, title: "Next General Body Meeting", date: "Sept 30, 2025", content: "Mandatory attendance for all members to discuss the upcoming tech fest." },
    { id: 2, title: "New Project Team Formation", date: "Sept 28, 2025", content: "Looking for enthusiastic members for the Web 3.0 development project." },
    { id: 3, title: "Mentorship Program Launch", date: "Sept 25, 2025", content: "Sign up to be paired with a senior mentor for specialized guidance." },
];

const DUMMY_EVENTS = [
    { id: 1, title: "Annual Hackathon 2025", date: "Oct 15, 2025", location: "Auditorium A", status: "Open" },
    { id: 2, title: "Python Basics Workshop", date: "Oct 5, 2025", location: "Lab 305", status: "Full" },
    { id: 3, title: "Networking Mixer", date: "Sept 29, 2025", location: "Cafeteria Terrace", status: "Open" },
];

const ClubDetailsPage = () => {
    // Get the club name from the URL parameter (e.g., from /clubs/Tech-Club)
    const { clubNameParam } = useParams();
    // Convert URL param (e.g., "Tech-Club") back to display name ("Tech Club")
    const clubName = clubNameParam ? clubNameParam.replace(/-/g, ' ') : 'Club Details';

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [view, setView] = useState('announcements'); // 'announcements' or 'events'

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <main className="main-content">
                <div className="page-content" style={{ maxWidth: '100%', padding: '2rem' }}>
                    
                    <div className="club-header">
                        <h1 className="page-title">{clubName}</h1>
                        <p className="club-subtitle">Welcome to the official page for the {clubName}. Find the latest updates below.</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex-tabs">
                        <button 
                            className={`tab-button ${view === 'announcements' ? 'active' : ''}`}
                            onClick={() => setView('announcements')}
                        >
                            Announcements ({DUMMY_ANNOUNCEMENTS.length})
                        </button>
                        <button 
                            className={`tab-button ${view === 'events' ? 'active' : ''}`}
                            onClick={() => setView('events')}
                        >
                            Upcoming Events ({DUMMY_EVENTS.length})
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="content-area-club">
                        {view === 'announcements' && (
                            // Annoucements uses a clean list layout
                            <div className="announcements-list">
                                {DUMMY_ANNOUNCEMENTS.map(announcement => (
                                    <div key={announcement.id} className="announcement-card">
                                        <h3 className="announcement-title">{announcement.title}</h3>
                                        <p className="announcement-meta">Posted: 🗓️ {announcement.date}</p>
                                        <p className="announcement-content">{announcement.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === 'events' && (
                            // Events uses a grid card layout
                            <div className="events-grid">
                                {DUMMY_EVENTS.map(event => (
                                    <div key={event.id} className="event-card-item">
                                        <h3 className="event-item-title">{event.title}</h3>
                                        <div className="event-details">
                                            <p>🗓️ {event.date}</p>
                                            <p>📍 {event.location}</p>
                                            <span className={`event-status status-${event.status.toLowerCase()}`}>{event.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClubDetailsPage;
