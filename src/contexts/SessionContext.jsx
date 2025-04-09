import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  saveSession,
  getUserSessions,
  getSession,
  updateSession,
  deleteSession
} from '../services/firebase';

// Session context aanmaken
const SessionContext = createContext();

// Session provider component
export const SessionProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [userSessions, setUserSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Laad sessies wanneer de gebruiker inlogt
  useEffect(() => {
    const loadSessions = async () => {
      if (isAuthenticated && currentUser) {
        setLoading(true);
        try {
          const sessions = await getUserSessions(currentUser.uid);
          setUserSessions(sessions);
          setError(null);
        } catch (err) {
          console.error("Error loading sessions:", err);
          setError("Er is een fout opgetreden bij het laden van je sessies.");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset state als gebruiker uitlogt
        setUserSessions([]);
        setCurrentSession(null);
      }
    };

    loadSessions();
  }, [currentUser, isAuthenticated]);

  // Nieuwe sessie opslaan
  const createNewSession = async (sessionData) => {
    if (!isAuthenticated || !currentUser) {
      throw new Error("Je moet ingelogd zijn om een sessie op te slaan.");
    }

    setLoading(true);
    try {
      console.log("Creating new session for user:", currentUser.uid);
      console.log("Session data:", sessionData);

      // Maak een kopie van de sessiedata om problemen te voorkomen
      const cleanedSessionData = { ...sessionData };

      // Zorg ervoor dat de datum correct is
      if (!cleanedSessionData.createdAt) {
        cleanedSessionData.createdAt = new Date().toISOString();
      } else if (cleanedSessionData.createdAt instanceof Date) {
        cleanedSessionData.createdAt = cleanedSessionData.createdAt.toISOString();
      }

      try {
        const sessionId = await saveSession(currentUser.uid, cleanedSessionData);
        console.log("Session created with ID:", sessionId);

        if (!sessionId) {
          throw new Error("Geen sessie-ID ontvangen bij het opslaan");
        }

        const newSession = { id: sessionId, ...cleanedSessionData };
        setUserSessions(prevSessions => [...prevSessions, newSession]);
        setCurrentSession(newSession);
        setError(null);

        // Zorg ervoor dat loading state wordt gereset
        setLoading(false);

        return sessionId;
      } catch (saveError) {
        console.error("Error in saveSession:", saveError);
        throw saveError; // Gooi de fout door naar de outer catch
      }
    } catch (err) {
      console.error("Error creating session:", err);
      setError("Er is een fout opgetreden bij het opslaan van je sessie.");
      setLoading(false); // Zorg ervoor dat loading state wordt gereset bij een fout
      throw err;
    }
  };

  // Sessie laden
  const loadSession = async (sessionId) => {
    if (!isAuthenticated || !currentUser) {
      throw new Error("Je moet ingelogd zijn om een sessie te laden.");
    }

    setLoading(true);
    try {
      const session = await getSession(currentUser.uid, sessionId);
      setCurrentSession(session);
      setError(null);
      return session;
    } catch (err) {
      console.error("Error loading session:", err);
      setError("Er is een fout opgetreden bij het laden van je sessie.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sessie bijwerken
  const updateCurrentSession = async (sessionData) => {
    if (!isAuthenticated || !currentUser || !currentSession) {
      throw new Error("Je moet ingelogd zijn en een actieve sessie hebben om deze bij te werken.");
    }

    setLoading(true);
    try {
      await updateSession(currentUser.uid, currentSession.id, sessionData);
      const updatedSession = { ...currentSession, ...sessionData };
      setCurrentSession(updatedSession);

      // Update ook in de lijst met sessies
      const updatedSessions = userSessions.map(session =>
        session.id === currentSession.id ? updatedSession : session
      );
      setUserSessions(updatedSessions);

      setError(null);
      return updatedSession;
    } catch (err) {
      console.error("Error updating session:", err);
      setError("Er is een fout opgetreden bij het bijwerken van je sessie.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sessie verwijderen
  const removeSession = async (sessionId) => {
    if (!isAuthenticated || !currentUser) {
      throw new Error("Je moet ingelogd zijn om een sessie te verwijderen.");
    }

    setLoading(true);
    try {
      await deleteSession(currentUser.uid, sessionId);

      // Verwijder uit de lijst met sessies
      const updatedSessions = userSessions.filter(session => session.id !== sessionId);
      setUserSessions(updatedSessions);

      // Reset huidige sessie als die verwijderd is
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(null);
      }

      setError(null);
      return true;
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Er is een fout opgetreden bij het verwijderen van je sessie.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context waarde
  const value = {
    userSessions,
    currentSession,
    loading,
    error,
    createNewSession,
    loadSession,
    updateCurrentSession,
    removeSession,
    setCurrentSession
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook voor het gebruiken van de session context
export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionContext;
