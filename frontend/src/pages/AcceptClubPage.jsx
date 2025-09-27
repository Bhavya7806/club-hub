import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot, updateDoc, getDoc } from 'firebase/firestore'; // Added getDoc
import { db } from '../firebase';
import '../Admin.css'; 

// --- Component Definition ---

const AcceptClubPage = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAction, setSelectedAction] = useState({ id: null, type: null }); // { id: clubId, type: 'accept' | 'reject' }
    const [startDate, setStartDate] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [submissionError, setSubmissionError] = useState(null);

    // Fetch pending club requests
    useEffect(() => {
        const q = query(
            collection(db, 'clubRequests'), 
            where('status', '==', 'Pending Admin Review')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingRequests(requests);
            setLoading(false);
        }, (err) => {
            console.error("Firestore Club Requests Fetch Error:", err);
            setSubmissionError("Failed to load requests due to a network or permission error.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    // --- Handlers ---

    const handleApprove = async (e, club) => { // Passed the full club object
        e.preventDefault();
        if (!startDate) {
            setSubmissionError("Please select a start date for the club.");
            return;
        }
        
        // Ensure the club data has the submitter's UID and email
        if (!club.submittedByUid || !club.submittedByEmail) {
            setSubmissionError("Error: Missing submitter identity. Cannot assign president.");
            return;
        }

        try {
            // 1. Update the Club Request status
            await updateDoc(doc(db, 'clubRequests', club.id), {
                status: 'Approved',
                startDate: startDate,
                approvedBy: getAuth().currentUser.email,
                approvedAt: new Date(),
                presidentEmail: club.submittedByEmail // Store president email in the club doc
            });

            // 2. CRITICAL FIX: Update the student's profile to assign the president role
            const userDocRef = doc(db, 'user_profiles', club.submittedByUid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                await updateDoc(userDocRef, {
                    // This new field stores the name of the club the user presides over
                    presidentOf: club.clubName, 
                    // Optional: Update their primary role to include 'president' status
                    role: 'president', 
                });
                console.log(`User ${club.submittedByEmail} assigned President role for ${club.clubName}.`);
            } else {
                console.warn(`User profile not found for UID: ${club.submittedByUid}. Club approved, but President role not assigned.`);
            }


            alert(`Club successfully approved and President assigned to ${club.submittedByEmail}!`);
            setSelectedAction({ id: null, type: null }); // Close form
            setStartDate(''); // Reset date
        } catch (error) {
            console.error("Approval Error:", error);
            setSubmissionError("Failed to approve club. Check console for details.");
        }
    };

    const handleReject = async (e, clubId) => {
        e.preventDefault();
        if (!rejectReason.trim()) {
            setSubmissionError("Please provide a reason for rejection.");
            return;
        }

        try {
            await updateDoc(doc(db, 'clubRequests', clubId), {
                status: 'Rejected',
                rejectionReason: rejectReason,
                rejectedBy: getAuth().currentUser.email,
                rejectedAt: new Date(),
            });
            
            alert("Club successfully rejected.");
            setSelectedAction({ id: null, type: null }); // Close form
            setRejectReason(''); // Reset reason
        } catch (error) {
            console.error("Rejection Error:", error);
            setSubmissionError("Failed to reject club. Check console for details.");
        }
    };

    const renderActionForm = (club) => {
        // ... (Form rendering logic remains the same, passing club object to handlers)
        if (selectedAction.type === 'accept') {
            return (
                <form className="action-form" onSubmit={(e) => handleApprove(e, club)}>
                    <p style={{marginBottom: '1rem', color: '#0d6efd'}}>President will be assigned to: <strong>{club.submittedByEmail}</strong></p>
                    <label>Club Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="btn-submit-action btn-submit-accept">Confirm Approval & Assign President</button>
                </form>
            );
        } else if (selectedAction.type === 'reject') {
            return (
                <form className="action-form" onSubmit={(e) => handleReject(e, club.id)}>
                    <label>Reason for Rejection:</label>
                    <textarea 
                        rows="3" 
                        value={rejectReason} 
                        onChange={(e) => setRejectReason(e.target.value)} 
                        placeholder="State the reasons for rejection clearly..."
                        required 
                    />
                    <button type="submit" className="btn-submit-action btn-submit-reject">Confirm Rejection</button>
                </form>
            );
        }
        return null;
    };


    return (
        <div className="admin-approval-container">
            <div className="approval-content">
                <h1 className="approval-title">Club Approval Center</h1>

                {loading && <p style={{ textAlign: 'center', color: 'white' }}>Loading pending requests...</p>}
                {submissionError && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{submissionError}</p>}
                
                {pendingRequests.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '10px' }}>
                        🎉 No club requests currently pending review.
                    </p>
                )}

                {pendingRequests.map((club) => (
                    <div key={club.id} className="request-card">
                        
                        <div className="card-header">
                            <h3>{club.clubName}</h3>
                        </div>

                        <div className="card-details">
                            <p><strong>Type:</strong> {club.clubType}</p>
                            <p><strong>Submitted by:</strong> {club.submittedByEmail || club.email}</p> 
                            <p><strong>Submitted on:</strong> {new Date(club.submittedAt?.toDate()).toLocaleDateString() || 'N/A'}</p>
                        </div>

                        {/* Admin Action Panel */}
                        <div className="action-panel">
                            <button 
                                className="action-btn btn-accept"
                                onClick={() => setSelectedAction({ id: club.id, type: 'accept' })}
                            >
                                Accept Club
                            </button>
                            <button 
                                className="action-btn btn-reject"
                                onClick={() => setSelectedAction({ id: club.id, type: 'reject' })}
                            >
                                Reject Club
                            </button>
                        </div>
                        
                        {/* Conditional Form Display */}
                        {selectedAction.id === club.id && renderActionForm(club)}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcceptClubPage;
