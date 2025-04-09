import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = ({ onClose }) => {
  const { loginWithGoogle, loginWithApple, isAuthenticated, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Als de gebruiker al is ingelogd, sluit het login scherm
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (onClose) onClose();
    }
  }, [isAuthenticated, currentUser, onClose]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Verhoog de retry teller
      setRetryCount(prev => prev + 1);

      // Log voor debugging
      console.log(`Attempting Google login (attempt ${retryCount + 1})`);

      await loginWithGoogle();
      if (onClose) onClose();
    } catch (error) {
      console.error('Google login error:', error);

      // Toon specifieke foutmeldingen
      if (error.message) {
        setError(error.message);
      } else {
        setError('Er is een fout opgetreden bij het inloggen met Google. Probeer het opnieuw.');
      }

      // Log extra informatie voor debugging
      if (error.code) {
        console.error('Error code:', error.code);
      }
    } finally {
      setLoading(false);
    }
  };

  // Functie om de login opnieuw te proberen met een kleine vertraging
  const retryGoogleLogin = () => {
    setError('');
    setTimeout(() => {
      handleGoogleLogin();
    }, 1000);
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithApple();
      if (onClose) onClose();
    } catch (error) {
      console.error('Apple login error:', error);
      setError('Er is een fout opgetreden bij het inloggen met Apple. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Inloggen</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <p className="login-info">
        Log in om je coaching sessies op te slaan en later opnieuw te gebruiken.
      </p>

      {error && (
        <div className="login-error">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={retryGoogleLogin}
            disabled={loading}
          >
            Probeer opnieuw
          </button>
        </div>
      )}

      <div className="login-buttons">
        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v3.2h5.59c-0.25,1.6-1.75,4.7-5.59,4.7c-3.36,0-6.1-2.79-6.1-6.2c0-3.42,2.74-6.2,6.1-6.2 c1.92,0,3.2,0.82,3.94,1.5l2.69-2.6C16.9,3.94,14.65,3,12,3C7.31,3,3.5,6.81,3.5,11.5c0,4.69,3.81,8.5,8.5,8.5 c4.9,0,8.15-3.45,8.15-8.3C20.15,10.95,20.15,10.47,21.35,11.1z" fill="#4285F4"></path>
            </g>
          </svg>
          Inloggen met Google
        </button>

        <button
          className="apple-login-button"
          onClick={handleAppleLogin}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M17.05,12.04c-0.03-2.88,2.35-4.28,2.46-4.35c-1.34-1.96-3.42-2.23-4.17-2.26c-1.77-0.18-3.46,1.04-4.36,1.04 c-0.9,0-2.29-1.02-3.77-0.99C5.46,5.52,3.85,6.53,2.96,8.1C1.14,11.28,2.5,16.01,4.26,18.5c0.88,1.27,1.92,2.7,3.29,2.65 c1.32-0.05,1.82-0.85,3.42-0.85c1.59,0,2.05,0.85,3.44,0.82c1.42-0.02,2.33-1.29,3.2-2.57c1.01-1.47,1.42-2.9,1.45-2.97 C18.99,15.54,17.08,14.48,17.05,12.04z M14.69,4.7c0.73-0.88,1.22-2.11,1.09-3.33c-1.05,0.04-2.32,0.7-3.08,1.58 c-0.68,0.78-1.27,2.03-1.11,3.22C12.72,6.25,13.96,5.58,14.69,4.7z" fill="#000000"></path>
            </g>
          </svg>
          Inloggen met Apple
        </button>
      </div>

      {loading && (
        <div className="login-loading">
          <div className="spinner"></div>
          <p>Bezig met inloggen...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
