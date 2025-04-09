import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInWithGoogle, signInWithGoogleRedirect, checkRedirectResult, signInWithApple, logOut } from '../services/firebase';

// Auth context aanmaken
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect voor het luisteren naar auth state veranderingen en redirect resultaten
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Controleer eerst of er een redirect resultaat is
        const redirectUser = await checkRedirectResult();
        if (redirectUser) {
          setCurrentUser(redirectUser);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking redirect result:", error);
      }

      // Luister naar auth state veranderingen
      const unsubscribe = onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup functie
    };

    checkAuth();
  }, []);

  // Inloggen met Google
  const loginWithGoogle = async () => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      console.error("Error in loginWithGoogle:", error);
      throw error;
    }
  };

  // Inloggen met Apple
  const loginWithApple = async () => {
    try {
      return await signInWithApple();
    } catch (error) {
      console.error("Error in loginWithApple:", error);
      throw error;
    }
  };

  // Uitloggen
  const logout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  };

  // Context waarde
  const value = {
    currentUser,
    loginWithGoogle,
    loginWithApple,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook voor het gebruiken van de auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
