import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase';
import '../Admin.css'; // Import the dedicated admin styles

// --- Component Definition ---

const AcceptEventPage = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAction, setSelectedAction] = useState({ id: null, type: null }); // { id: eventId, type: 'accept' | 'reject' }
    const [newVenue, setNewVenue] = useState(''); // State for changing the venue during acceptance
    const [rejectReason, setRejectReason] = useState('');
    const [submissionError, setSubmissionError] = useState(null);

    // Fetch pending event requests
    useEffect(() => {
        const q = query(
            collection(db, 'eventRequests'), 
            where('status', '==', 'Pending Admin Review')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingRequests(requests);
            setLoading(false);
        }, (err) => {
            console.error("Firestore Event Requests Fetch Error:", err);
            setSubmissionError("Failed to load requests due to a network or permission error.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    // --- Handlers ---

    const handleApprove = async (e, eventId, originalVenue) => {
        e.preventDefault();
        setSubmissionError(null);
        
        // Use the newVenue if provided, otherwise use the original venue
        const finalVenue = newVenue.trim() || originalVenue;

        try {
            await updateDoc(doc(db, 'eventRequests', eventId), {
                status: 'Approved',
                eventVenue: finalVenue, // CRITICAL: Update the venue field
                approvedBy: getAuth().currentUser.email,
                approvedAt: new Date(),
            });

            alert(`Event successfully approved! Final venue is set to ${finalVenue}.`);
            setSelectedAction({ id: null, type: null }); // Close form
            setNewVenue(''); // Reset venue
        } catch (error) {
            console.error("Approval Error:", error);
            setSubmissionError("Failed to approve event. Check console for details.");
        }
    };

    const handleReject = async (e, eventId) => {
        e.preventDefault();
        setSubmissionError(null);
        if (!rejectReason.trim()) {
            setSubmissionError("Please provide a reason for rejection.");
            return;
        }

        try {
            await updateDoc(doc(db, 'eventRequests', eventId), {
                status: 'Rejected',
                rejectionReason: rejectReason,
                rejectedBy: getAuth().currentUser.email,
                rejectedAt: new Date(),
            });
            
            alert("Event successfully rejected.");
            setSelectedAction({ id: null, type: null }); // Close form
            setRejectReason(''); // Reset reason
        } catch (error) {
            console.error("Rejection Error:", error);
            setSubmissionError("Failed to reject event. Check console for details.");
        }
    };

    const renderActionForm = (event) => {
        if (selectedAction.type === 'accept') {
            return (
                <form className="action-form" onSubmit={(e) => handleApprove(e, event.id, event.eventVenue)}>
                    <label>Original Venue:</label>
                    <input 
                        type="text" 
                        value={event.eventVenue} 
                        disabled 
                        style={{ background: '#e9ecef', color: '#6c757d', marginBottom: '1rem' }}
                    />
                    <label>New/Confirm Venue (Optional Change):</label>
                    <input 
                        type="text" 
                        value={newVenue} 
                        onChange={(e) => setNewVenue(e.target.value)} 
                        placeholder={event.eventVenue} /* Suggests the original venue */
                    />
                    <button type="submit" className="btn-submit-action btn-submit-accept">Confirm Approval</button>
                </form>
            );
        } else if (selectedAction.type === 'reject') {
            return (
                <form className="action-form" onSubmit={(e) => handleReject(e, event.id)}>
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
        // Uses the dedicated admin background styles
        <div className="admin-approval-container">
            <div className="approval-content">
                <h1 className="approval-title">Event Approval Center</h1>

                {loading && <p style={{ textAlign: 'center', color: 'white' }}>Loading pending requests...</p>}
                {submissionError && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{submissionError}</p>}
                
                {pendingRequests.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '10px' }}>
                        🎉 No event requests currently pending review.
                    </p>
                )}

                {pendingRequests.map((event) => (
                    <div key={event.id} className="request-card">
                        
                        <div className="card-header">
                            <h3>{event.eventName}</h3>
                        </div>

                        <div className="card-details">
                            <p><strong>Club:</strong> {event.club}</p>
                            <p><strong>Type:</strong> {event.eventType}</p>
                            <p><strong>Date:</strong> {event.eventDate}</p>
                            <p><strong>Venue:</strong> {event.eventVenue}</p>
                            <p><strong>Submitted by:</strong> {event.submittedByEmail}</p>
                        </div>

                        {/* Admin Action Panel */}
                        <div className="action-panel">
                            <button 
                                className="action-btn btn-accept"
                                onClick={() => setSelectedAction({ id: event.id, type: 'accept' })}
                            >
                                Accept (Change Venue)
                            </button>
                            <button 
                                className="action-btn btn-reject"
                                onClick={() => setSelectedAction({ id: event.id, type: 'reject' })}
                            >
                                Reject (Reason)
                            </button>
                        </div>
                        
                        {/* Conditional Form Display */}
                        {selectedAction.id === event.id && renderActionForm(event)}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcceptEventPage;
