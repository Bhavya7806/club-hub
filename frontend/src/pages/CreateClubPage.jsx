import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import '../Admin.css'; // Uses the dedicated admin background/form styling

// Define the available club types
const clubTypes = [
    'Academic',
    'Technical',
    'Cultural',
    'Sports',
    'Service/Volunteer',
    'Hobby/Interest'
];

const CreateClubPage = () => {
    const navigate = useNavigate();
    // Get the current authenticated user object
    const authUser = getAuth().currentUser; 
    
    const [clubName, setClubName] = useState('');
    const [clubType, setClubType] = useState(clubTypes[0]);
    const [clubLogo, setClubLogo] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage(null);

        if (!authUser) {
             setSuccessMessage("Error: You must be logged in to submit a request.");
             setIsSubmitting(false);
             return;
        }

        const logoUrl = clubLogo ? `/logos/${clubLogo.name}` : null;
        
        try {
            // CRITICAL: Submit the club data to 'clubRequests' with submitter's identity
            await addDoc(collection(db, 'clubRequests'), {
                clubName,
                clubType,
                clubLogoUrl: logoUrl,
                status: 'Pending Admin Review',
                submittedAt: Timestamp.fromDate(new Date()),
                submittedByUid: authUser.uid,
                submittedByEmail: authUser.email, 
            });
            
            setSuccessMessage(`Club request for "${clubName}" has been successfully sent to the admin team for approval.`);
            setClubName('');
            setClubType(clubTypes[0]);
            setClubLogo(null);
            
            setTimeout(() => setSuccessMessage(null), 5000);

        } catch (error) {
            console.error("Error submitting club request:", error);
            setSuccessMessage(`Error submitting request: Missing or insufficient permissions.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setClubLogo(e.target.files[0]);
        }
    };

    return (
        <div className="create-club-container">
            {successMessage && (
                <div className="submission-message">
                    <span className="message-icon">✅</span>
                    <p>{successMessage}</p>
                </div>
            )}

            <div className="glass-card">
                <h1 className="glass-title">Start a New Club</h1>
                <p className="glass-subtitle">Fill out the details below to submit your club proposal for review.</p>

                <form className="club-form" onSubmit={handleSubmit}>
                    
                    {/* 1. Club Name */}
                    <div className="form-group">
                        <label htmlFor="clubName">Club Name</label>
                        <input
                            id="clubName"
                            type="text"
                            placeholder="e.g., Quantum Computing Society"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            required
                        />
                    </div>

                    {/* 2. Type of Club */}
                    <div className="form-group">
                        <label htmlFor="clubType">Type of Club</label>
                        <select
                            id="clubType"
                            value={clubType}
                            onChange={(e) => setClubType(e.target.value)}
                            required
                        >
                            {clubTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Club Logo */}
                    <div className="form-group">
                        <label htmlFor="clubLogo">Club Logo (Optional)</label>
                        <input
                            id="clubLogo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="file-input"
                        />
                        {clubLogo && <p className="file-info">Selected: {clubLogo.name}</p>}
                    </div>
                    
                    <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Club Proposal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateClubPage;