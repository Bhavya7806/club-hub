// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase'; 

// --- CONFIGURATION CONSTANTS ---
const STUDENT_DOMAIN = '@vitapstudent.ac.in';
const ADMIN_EMAIL = 'admin@vitap.ac.in'; // The single allowed Admin email
const USER_COLLECTION = 'user_profiles'; // 💡 New Firestore collection name

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="google-icon" style={{ marginRight: '0.75rem' }}>
        <path d="M22.56 12.25c0-.66-.06-1.29-.19-1.92H12.25v3.63h5.79c-.24 1.34-.94 2.48-2.06 3.23l-.11.12 3.1 2.39.22.08c1.94-1.78 3.08-4.32 3.08-7.53z" fill="#4285F4"/>
        <path d="M12.25 23.5c3.31 0 6.08-1.09 8.08-3.04l-3.32-2.58c-.92.61-2.09.97-3.69.97-2.85 0-5.32-1.93-6.19-4.51H2.43v2.67c1.77 3.51 5.34 5.48 9.82 5.48z" fill="#34A853"/>
        <path d="M6.06 14.15c-.17-.48-.26-.98-.26-1.47 0-.5.09-1.01.26-1.49V8.5H2.43c-.47.96-.73 2.05-.73 3.19s.26 2.22.73 3.18l3.63-2.62z" fill="#FBBC05"/>
        <path d="M12.25 5.5c1.65 0 3.18.6 4.39 1.76l2.91-2.9C18.33 1.83 15.65.5 12.25.5c-4.48 0-8.05 1.97-9.82 5.48l3.63 2.62c.87-2.58 3.34-4.51 6.19-4.51z" fill="#EA4335"/>
    </svg>
);


const AuthPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  // Admin starts on Login, Students can toggle
  const [isLoginView, setIsLoginView] = useState(role === 'admin' ? true : true); 

  const titleRole = role.charAt(0).toUpperCase() + role.slice(1);

  const switchView = (isLogin) => {
    // Only allow students to switch to Sign Up
    if (role === 'admin' && !isLogin) return; 

    setIsLoginView(isLogin);
    setError(null);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const redirectToDashboard = () => {
      navigate(`/${role}/dashboard`);
  };

  // --- 1. Email/Password Authentication Handler ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null); 
    
    const emailLower = email.toLowerCase();

    // 💡 ADMIN RESTRICTION: Check for specific admin email
    if (role === 'admin' && emailLower !== ADMIN_EMAIL) {
        setError(`Access denied. The Admin login is restricted to ${ADMIN_EMAIL}.`);
        return;
    }
    
    // STUDENT RESTRICTION: Check for required student domain
    if (role === 'student' && !emailLower.endsWith(STUDENT_DOMAIN)) {
        setError(`Please use your college email ID ending with ${STUDENT_DOMAIN} to sign in or sign up.`);
        return;
    }
    
    // General Sign Up validation (only for student role)
    if (!isLoginView && !username.trim()) {
        setError("Username is required for sign up.");
        return;
    }

    try {
      if (isLoginView) {
        // LOGIN LOGIC
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // SIGN UP LOGIC (Only available for students)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user; 
        
        if (newUser) {
            try {
                // 💡 Use new collection name: USER_COLLECTION
                await setDoc(doc(db, USER_COLLECTION, newUser.uid), {
                  uid: newUser.uid,
                  email: newUser.email,
                  username: username, 
                  role: role,
                  createdAt: new Date(),
                });
                console.log(`SUCCESS: ${role} data saved to '${USER_COLLECTION}/${newUser.uid}' collection.`);
            } catch (firestoreError) {
                console.error("CRITICAL FIRESTORE ERROR: Failed to save user profile data.", firestoreError);
                setError(`Profile save failed. Check Firestore rules for the '${USER_COLLECTION}' collection.`);
                return; 
            }
        } else {
             setError("Sign up failed internally. Please try again.");
             return;
        }
      }
      
      redirectToDashboard();

    } catch (err) {
      setError(err.message.replace('Firebase: Error (auth/', '').replace(').', ''));
    }
  };

  // --- 2. Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setError(null); 
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (!user) {
          setError("Google sign-in failed. Please try again.");
          return;
      }
      
      const emailLower = user.email.toLowerCase();
      let accessGranted = true;

      // 💡 ADMIN RESTRICTION: Check for specific admin email
      if (role === 'admin' && emailLower !== ADMIN_EMAIL) {
          accessGranted = false;
          setError(`Access denied. The Admin login is restricted to ${ADMIN_EMAIL}.`);
      }
      
      // STUDENT RESTRICTION: Check for required student domain
      if (role === 'student' && !emailLower.endsWith(STUDENT_DOMAIN)) {
          accessGranted = false;
          setError(`Access denied. Please use your college email ID ending with ${STUDENT_DOMAIN} to sign in as a student.`);
      }

      if (!accessGranted) {
          // Sign out immediately to revoke the session created by Google
          await signOut(auth); 
          return;
      }

      // Proceed with Firestore storage if access is granted
      const userDocRef = doc(db, USER_COLLECTION, user.uid); 
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        try {
            // 💡 Use new collection name: USER_COLLECTION
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName || user.email.split('@')[0], 
                role: role,
                createdAt: new Date(),
            }, { merge: true });
            console.log(`SUCCESS: New Google user added to '${USER_COLLECTION}/${user.uid}' collection as ${role}.`);
        } catch (firestoreError) {
             console.error("CRITICAL FIRESTORE ERROR: Failed to save Google user profile data.", firestoreError);
             setError(`Profile save failed. Check Firestore rules for the '${USER_COLLECTION}' collection.`);
             return;
        }
      }
      
      redirectToDashboard();

    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
          setError("Google sign-in was cancelled.");
      } else {
          setError(err.message.replace('Firebase: ', ''));
      }
    }
  };

  // Check if Sign Up button should even be shown (only for student role)
  const isSignUpAvailable = role === 'student';

  return (
    <div className="auth-page-container">
        <div className="auth-card">
            
            {/* Toggle Switch - Hidden or restricted for Admin */}
            {isSignUpAvailable && (
                <div className="auth-toggle"> 
                    <button onClick={() => switchView(true)} disabled={isLoginView}>Login</button>
                    <button onClick={() => switchView(false)} disabled={!isLoginView}>Sign Up</button>
                </div>
            )}
            
            <h1 className="auth-title">{isLoginView ? `${titleRole} Login` : `${titleRole} Sign Up`}</h1>

            {error && <p style={{ color: '#ff6b6b', textAlign: 'center', fontWeight: '500', padding: '0 1rem' }}>{error}</p>}
            
            {/* Email/Password Form */}
            <form className="auth-form" onSubmit={handleEmailAuth}>
                
                {/* Username field: Only shown if Sign Up is active (which is only for students) */}
                {isSignUpAvailable && !isLoginView && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">
                    {isLoginView ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            <div className="auth-divider">OR</div>
            
            {/* Google Sign-In Button */}
            <button 
                onClick={handleGoogleSignIn} 
                className="btn-google prominent" 
            > 
                <GoogleIcon />
                Sign In with Google 
            </button>
            
            {/* Back Link */}
            <div className="back-link-container"> 
                <button onClick={() => navigate('/')} className="back-link">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;