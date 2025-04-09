import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SessionManager from './SessionManager';
import Login from './Login';
import '../styles/MySessionsButton.css';

const MySessionsButton = ({ onLoadSession }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset error wanneer auth state verandert
  useEffect(() => {
    setError(null);
  }, [isAuthenticated, currentUser]);

  const handleClick = () => {
    setError(null);
    setLoading(true);

    try {
      if (isAuthenticated) {
        if (!currentUser) {
          setError('Gebruiker niet gevonden. Probeer opnieuw in te loggen.');
        } else {
          setShowSessionManager(true);
        }
      } else {
        setShowLoginModal(true);
      }
    } catch (err) {
      console.error('Error in handleClick:', err);
      setError(`Er is een fout opgetreden: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeSessionManager = () => {
    setShowSessionManager(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLoadSession = (session) => {
    if (onLoadSession) {
      onLoadSession(session);
    }
    closeSessionManager();
  };

  return (
    <div className="my-sessions-container">
      {error && (
        <div className="sessions-error-tooltip">{error}</div>
      )}

      <button
        className={`my-sessions-button ${loading ? 'loading' : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Laden...' : 'Mijn Sessies'}
      </button>

      {showSessionManager && (
        <div className="session-manager-modal" onClick={closeSessionManager}>
          <div onClick={e => e.stopPropagation()}>
            <SessionManager
              onClose={closeSessionManager}
              onLoadSession={handleLoadSession}
            />
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="login-modal" onClick={closeLoginModal}>
          <div onClick={e => e.stopPropagation()}>
            <Login onClose={closeLoginModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessionsButton;
