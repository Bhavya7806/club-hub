import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, collection, addDoc, getDoc, onSnapshot } from 'firebase/firestore'; // Added onSnapshot
import { db } from '../firebase';
import '../Admin.css'; 

// Example data for demonstration purposes
const eventTypes = [
    'Workshop', 'Competition', 'Seminar', 'Social Gathering', 'Performance', 'General Meeting'
];

const CreateEventPage = () => {
    const [userProfile, setUserProfile] = useState(null); 
    const [authUser, setAuthUser] = useState(getAuth().currentUser);
    
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState(eventTypes[0]);
    const [hostingClub, setHostingClub] = useState('Loading...'); // Club assigned by presidentOf role
    const [eventDate, setEventDate] = useState('');
    const [eventVenue, setEventVenue] = useState('');
    const [eventPoster, setEventPoster] = useState(null); 
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [validationError, setValidationError] = useState(null);

    // CRITICAL FIX: Real-time profile fetch independent of the Dashboard
    useEffect(() => {
        let unsubscribeProfile = () => {};
        
        const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
            unsubscribeProfile();
            setAuthUser(user);

            if (user) {
                const userDocRef = doc(db, 'user_profiles', user.uid);
                unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserProfile(data);
                        
                        if (data.presidentOf) {
                            setHostingClub(data.presidentOf);
                        } else {
                            setHostingClub('NO_CLUB_ASSIGNED'); 
                        }
                    } else {
                        setUserProfile(null);
                        setHostingClub('NO_CLUB_ASSIGNED');
                    }
                }, (error) => {
                    console.error("Error fetching event page profile:", error);
                });
            } else {
                setHostingClub('N/A');
                setUserProfile(null);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeProfile();
        };
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage(null);
        setValidationError(null);

        if (!authUser) {
             setValidationError("You must be logged in.");
             setIsSubmitting(false);
             return;
        }

        // CRITICAL CHECK: Enforce President-Only Submission (using the now real-time profile)
        if (!userProfile || userProfile.presidentOf !== hostingClub || hostingClub === 'NO_CLUB_ASSIGNED') {
            setValidationError(`Access Denied: You must be the assigned president of "${hostingClub}" to create an event.`);
            setIsSubmitting(false);
            return;
        }


        const posterUrl = eventPoster ? `/posters/${eventPoster.name}` : null;
        
        try {
            await addDoc(collection(db, 'eventRequests'), {
                eventName,
                eventType,
                club: hostingClub, 
                eventDate,
                eventVenue,
                posterUrl,
                status: 'Pending Admin Review',
                submittedAt: new Date(),
                submittedByEmail: authUser.email,
            });
            
            setSuccessMessage(`Event request for "${eventName}" submitted successfully!`);
            
            // Clear form fields
            setEventName('');
            setEventDate('');
            setEventVenue('');
            setEventPoster(null);
            
            setTimeout(() => setSuccessMessage(null), 5000);

        } catch (error) {
            console.error("Error submitting event request:", error);
            setValidationError(`Submission Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine authorization status
    const isAuthorized = userProfile && userProfile.presidentOf === hostingClub && hostingClub !== 'NO_CLUB_ASSIGNED';
    const clubAssigned = userProfile?.presidentOf;
    const authStatusMessage = clubAssigned
        ? `✅ Authorized: Submitting events for ${clubAssigned}.`
        : `❌ Unauthorized: You must be assigned as a Club President by the Admin to submit events.`;


    return (
        <div className="create-club-container">
            {successMessage && (
                <div className="submission-message">
                    <span className="message-icon">✅</span>
                    <p>{successMessage}</p>
                </div>
            )}

            <div className="glass-card">
                <h1 className="glass-title">Plan a New Event</h1>
                <p className="glass-subtitle">Detail your event below. Submission is restricted to assigned Club Presidents.</p>

                {/* Display Authorization Status */}
                <p style={{ 
                    color: isAuthorized ? '#10b981' : '#ff6b6b', 
                    background: isAuthorized ? 'rgba(16, 185, 129, 0.2)' : 'rgba(220, 53, 69, 0.2)', 
                    padding: '10px', 
                    borderRadius: '5px' 
                }}>
                    {authStatusMessage}
                </p>
                
                {validationError && <p style={{ color: '#ff6b6b', background: 'rgba(255, 230, 230, 0.8)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>{validationError}</p>}

                <form className="club-form" onSubmit={handleSubmit}>
                    
                    {/* 1. Event Name */}
                    <div className="form-group">
                        <label htmlFor="eventName">Event Name</label>
                        <input id="eventName" type="text" placeholder="e.g., Annual Hackathon 2025" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                    </div>

                    {/* 2. Event Type */}
                    <div className="form-group">
                        <label htmlFor="eventType">Event Type</label>
                        <select id="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)} required >
                            {eventTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                        </select>
                    </div>
                    
                    {/* 3. Hosting Club Name - Display only the authorized club */}
                    <div className="form-group">
                        <label htmlFor="hostingClub">Hosting Club</label>
                        <input
                            id="hostingClub"
                            type="text"
                            value={clubAssigned || 'Loading...'}
                            readOnly
                            style={{ 
                                backgroundColor: clubAssigned ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                cursor: 'default'
                            }}
                        />
                    </div>

                    {/* 4. Event Date */}
                    <div className="form-group">
                        <label htmlFor="eventDate">Date</label>
                        <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                    </div>

                    {/* 5. Venue */}
                    <div className="form-group">
                        <label htmlFor="eventVenue">Venue</label>
                        <input id="eventVenue" type="text" placeholder="e.g., Auditorium Hall B" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
                    </div>

                    {/* 6. Poster */}
                    <div className="form-group">
                        <label htmlFor="eventPoster">Event Poster (Optional)</label>
                        <input id="eventPoster" type="file" accept="image/*" onChange={(e) => setEventPoster(e.target.files[0])} className="file-input" />
                        {eventPoster && <p className="file-info">Selected: {eventPoster.name}</p>}
                    </div>
                    
                    <button type="submit" className="btn btn-submit" disabled={isSubmitting || !isAuthorized}>
                        {isSubmitting ? 'Requesting...' : 'Submit Event Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
