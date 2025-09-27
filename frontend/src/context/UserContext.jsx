import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase';

// 1. Create the Context
const UserContext = createContext();

// 2. Custom Hook to use the Context easily
export const useUser = () => useContext(UserContext);

// 3. Context Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [profile, setProfile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile = () => {};

        // Listen for Auth state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            unsubscribeProfile(); 
            setUser(authUser);
            setProfile(null); 
            
            if (authUser) {
                setIsLoading(true); // START loading profile data

                // Set up REAL-TIME listener for Firestore profile
                const userDocRef = doc(db, 'user_profiles', authUser.uid);
                unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => { 
                    if (docSnap.exists()) {
                        // Case 1: Document exists and is ready
                        setProfile(docSnap.data());
                    } else {
                        // Case 2: Document is missing (New sign-up or broken profile)
                        console.warn(`User profile document missing for UID: ${authUser.uid}. Attempting to create basic profile.`);
                        
                        const existingDoc = await getDoc(userDocRef);

                        if (!existingDoc.exists()) {
                            // Automatically create the basic profile document
                            await setDoc(userDocRef, {
                                uid: authUser.uid,
                                email: authUser.email,
                                username: authUser.displayName || authUser.email.split('@')[0],
                                role: 'student', 
                                createdAt: new Date(),
                                presidentOf: null 
                            });
                            // NOTE: The next onSnapshot event will capture this new document
                            // and run Case 1 logic immediately.
                            setProfile({
                                uid: authUser.uid,
                                email: authUser.email,
                                username: authUser.displayName || authUser.email.split('@')[0],
                                role: 'student',
                                presidentOf: null 
                            });
                        } else {
                            // If the document appeared between the snapshot and the getDoc check, just load it
                            setProfile(existingDoc.data());
                        }
                    }
                    setIsLoading(false); // END loading profile data
                }, (error) => {
                    console.error("Error fetching user profile:", error);
                    setProfile(null);
                    setIsLoading(false); // END loading on error
                });

            } else {
                // User logged out
                setIsLoading(false); // Done loading non-existent profile
            }
        });

        // Final cleanup function
        return () => {
            unsubscribeAuth();
            unsubscribeProfile();
        };
    }, []);

    // Helper to determine authorization status globally
    const isPresident = profile?.presidentOf && profile.presidentOf !== 'NO_CLUB_ASSIGNED';

    return (
        <UserContext.Provider value={{ user, profile, isLoading, isPresident }}>
            {children}
        </UserContext.Provider>
    );
};
