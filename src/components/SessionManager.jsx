import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/SessionManager.css';

const SessionManager = ({ onClose, onLoadSession }) => {
  const { userSessions, loading, error, removeSession, loadSession } = useSession();
  const { isAuthenticated } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionError, setActionError] = useState('');

  // Sessie laden
  const handleLoadSession = async (sessionId) => {
    try {
      const session = await loadSession(sessionId);
      if (onLoadSession) {
        onLoadSession(session);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setActionError('Er is een fout opgetreden bij het laden van de sessie.');
    }
  };

  // Sessie verwijderen bevestigen
  const confirmDelete = (sessionId) => {
    setDeleteConfirm(sessionId);
  };

  // Sessie verwijderen annuleren
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Sessie verwijderen
  const handleDeleteSession = async (sessionId) => {
    try {
      await removeSession(sessionId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting session:', err);
      setActionError('Er is een fout opgetreden bij het verwijderen van de sessie.');
    }
  };

  // Formateer datum
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'Onbekende datum';

      let date;
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        // Firestore Timestamp object
        date = timestamp.toDate();
      } else if (typeof timestamp === 'string') {
        // ISO string
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        // Date object
        date = timestamp;
      } else {
        // Fallback
        console.log('Onbekend datumformaat:', timestamp);
        return 'Onbekende datum';
      }

      // Controleer of de datum geldig is
      if (isNaN(date.getTime())) {
        console.error('Ongeldige datum:', timestamp);
        return 'Ongeldige datum';
      }

      return date.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Fout bij formatteren van datum:', error, timestamp);
      return 'Fout bij datum';
    }
  };

  // Sessie naam of standaard tekst
  const getSessionName = (session) => {
    if (session.name) return session.name;
    if (session.userInput && typeof session.userInput === 'string') {
      return session.userInput.substring(0, 30) + (session.userInput.length > 30 ? '...' : '');
    }
    return 'Sessie zonder naam';
  };

  if (!isAuthenticated) {
    return (
      <div className="session-manager">
        <div className="session-manager-header">
          <h2>Mijn Sessies</h2>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <p className="not-authenticated-message">
          Je moet ingelogd zijn om je sessies te beheren.
        </p>
      </div>
    );
  }

  return (
    <div className="session-manager">
      <div className="session-manager-header">
        <h2>Mijn Sessies</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="session-loading">
          <div className="spinner"></div>
          <p>Sessies laden...</p>
        </div>
      ) : error ? (
        <div className="session-error">
          <p>{error}</p>
        </div>
      ) : userSessions.length === 0 ? (
        <div className="no-sessions">
          <p>Je hebt nog geen sessies opgeslagen.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {userSessions.map(session => (
            <div key={session.id} className="session-item">
              <div className="session-info">
                <h3 className="session-title">{getSessionName(session)}</h3>
                <p className="session-date">
                  {formatDate(session.createdAt)}
                </p>
                <div className="session-details">
                  {session.selectedDiscType && (
                    <span className="session-tag">{session.selectedDiscType.label || 'Geen DISC'}</span>
                  )}
                  {session.selectedCoachingType && (
                    <span className="session-tag">{session.selectedCoachingType.label || 'Geen type'}</span>
                  )}
                  {session.selectedDuration && (
                    <span className="session-tag">{session.selectedDuration.label || 'Geen duur'}</span>
                  )}
                </div>
              </div>

              <div className="session-actions">
                {deleteConfirm === session.id ? (
                  <div className="delete-confirm">
                    <p>Weet je het zeker?</p>
                    <div className="confirm-buttons">
                      <button
                        className="confirm-yes"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        Ja
                      </button>
                      <button
                        className="confirm-no"
                        onClick={cancelDelete}
                      >
                        Nee
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className="load-button"
                      onClick={() => handleLoadSession(session.id)}
                    >
                      Laden
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => confirmDelete(session.id)}
                    >
                      Verwijderen
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {actionError && (
        <div className="action-error">
          <p>{actionError}</p>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
