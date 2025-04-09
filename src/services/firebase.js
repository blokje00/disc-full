// Firebase configuratie
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Firebase configuratie voor het disk-full-b006a project
const firebaseConfig = {
  apiKey: "AIzaSyAjmJ3ZBcJVEEQwkWHeV3VcEUnox3fje1g",
  authDomain: "disk-full-b006a.firebaseapp.com",
  projectId: "disk-full-b006a",
  storageBucket: "disk-full-b006a.firebasestorage.app",
  messagingSenderId: "264987501976",
  appId: "1:264987501976:web:a6a9a97cf9444643a837ed",
  measurementId: "G-CMHJ5JKF04"
};

// Firebase initialiseren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google auth provider
const googleProvider = new GoogleAuthProvider();

// Voeg de benodigde scopes toe
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Voeg extra parameters toe om inlogproblemen op te lossen
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline',
  // Voeg de project naam toe voor betere identificatie
  login_hint: 'project-264987501976'
});

// Apple auth provider
const appleProvider = new OAuthProvider('apple.com');

// Inloggen met Google via popup
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting to sign in with Google via popup...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign in successful", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google via popup:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Als popup geblokkeerd is, probeer redirect methode
    if (error.code === 'auth/popup-blocked') {
      console.log("Popup blocked, trying redirect method...");
      return signInWithGoogleRedirect();
    }

    // Specifieke foutafhandeling
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Inlogvenster werd gesloten. Probeer het opnieuw.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Inlogverzoek werd geannuleerd. Probeer het opnieuw.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Netwerkfout. Controleer je internetverbinding.');
    }
    throw error;
  }
};

// Inloggen met Google via redirect
export const signInWithGoogleRedirect = async () => {
  try {
    console.log("Attempting to sign in with Google via redirect...");
    await signInWithRedirect(auth, googleProvider);
    // Deze functie keert niet terug omdat de pagina wordt doorverwezen
  } catch (error) {
    console.error("Error signing in with Google via redirect:", error);
    throw error;
  }
};

// Controleer redirect resultaat
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Redirect result received", result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error getting redirect result:", error);
    throw error;
  }
};

// Inloggen met Apple
export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Apple:", error);
    throw error;
  }
};

// Uitloggen
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Huidige gebruiker ophalen
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Luisteren naar auth state veranderingen
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

// Sessie opslaan
export const saveSession = async (userId, sessionData) => {
  try {
    console.log("Saving session for user:", userId);
    console.log("Session data:", sessionData);

    // Zorg ervoor dat we een geldig userId hebben
    if (!userId) {
      const error = new Error("Geen gebruikers-ID opgegeven voor het opslaan van de sessie");
      console.error(error);
      throw error;
    }

    // Maak een kopie van de sessiedata en verwijder eventuele ongeldige velden
    const cleanedSessionData = { ...sessionData };

    // Verwijder complexe objecten die niet door Firestore worden ondersteund
    // en vervang ze door eenvoudige representaties
    Object.keys(cleanedSessionData).forEach(key => {
      const value = cleanedSessionData[key];

      // Als het een object is met een 'toJSON' methode, gebruik die
      if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
        cleanedSessionData[key] = value.toJSON();
      }

      // Als het een Date object is, converteer naar string
      if (value instanceof Date) {
        cleanedSessionData[key] = value.toISOString();
      }

      // Als het een functie is, verwijder het
      if (typeof value === 'function') {
        delete cleanedSessionData[key];
      }
    });

    // Zorg ervoor dat createdAt en updatedAt altijd strings zijn
    if (cleanedSessionData.createdAt instanceof Date) {
      cleanedSessionData.createdAt = cleanedSessionData.createdAt.toISOString();
    }

    // Voeg de sessie toe aan de database
    console.log("Cleaned session data:", cleanedSessionData);
    const sessionsRef = collection(db, 'users', userId, 'sessions');

    try {
      const docRef = await addDoc(sessionsRef, {
        ...cleanedSessionData,
        updatedAt: new Date().toISOString()
      });

      console.log("Session saved successfully with ID:", docRef.id);
      return docRef.id;
    } catch (firestoreError) {
      console.error("Firestore error while saving session:", firestoreError);

      // Probeer een vereenvoudigde versie van de data op te slaan als er een fout optreedt
      const simplifiedData = {
        userInput: cleanedSessionData.userInput || '',
        coachResponse: cleanedSessionData.coachResponse || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("Trying with simplified data:", simplifiedData);
      const docRef = await addDoc(sessionsRef, simplifiedData);
      console.log("Session saved with simplified data, ID:", docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

// Sessies ophalen voor een gebruiker
export const getUserSessions = async (userId) => {
  try {
    console.log("Getting sessions for user:", userId);

    // Zorg ervoor dat we een geldig userId hebben
    if (!userId) {
      console.error("Geen gebruikers-ID opgegeven voor het ophalen van sessies");
      return [];
    }

    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsRef);

    try {
      const querySnapshot = await getDocs(q);
      console.log(`Query returned ${querySnapshot.size} documents`);

      const sessions = [];
      querySnapshot.forEach((doc) => {
        try {
          const sessionData = doc.data();
          console.log(`Session ${doc.id} data:`, sessionData);

          sessions.push({
            id: doc.id,
            ...sessionData
          });
        } catch (docError) {
          console.error(`Error processing document ${doc.id}:`, docError);
        }
      });

      console.log(`Processed ${sessions.length} sessions for user ${userId}`);
      return sessions;
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return [];
    }
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
};

// Specifieke sessie ophalen
export const getSession = async (userId, sessionId) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
      return {
        id: sessionSnap.id,
        ...sessionSnap.data()
      };
    } else {
      throw new Error("Session not found");
    }
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
};

// Sessie bijwerken
export const updateSession = async (userId, sessionId, sessionData) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      ...sessionData,
      updatedAt: new Date()
    });
    return sessionId;
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

// Sessie verwijderen
export const deleteSession = async (userId, sessionId) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    await deleteDoc(sessionRef);
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

export { auth, db };
