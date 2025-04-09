import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import '../styles/SaveSessionButton.css';

const SaveSessionButton = ({
  sessionData,
  disabled = false,
  onSaveSuccess = () => {},
  onSaveError = () => {}
}) => {
  const { createNewSession, updateCurrentSession, currentSession } = useSession();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!sessionData || !sessionData.userInput) {
      onSaveError('Er is geen sessie om op te slaan.');
      return;
    }

    setSaving(true);
    try {
      console.log('Saving session data:', sessionData);

      // Maak een kopie van de sessiedata om problemen te voorkomen
      const cleanedSessionData = { ...sessionData };

      // Verwijder complexe objecten die niet door Firestore worden ondersteund
      Object.keys(cleanedSessionData).forEach(key => {
        const value = cleanedSessionData[key];

        // Als het een object is met een 'toJSON' methode, gebruik die
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
          cleanedSessionData[key] = value.toJSON();
        }

        // Als het een functie is, verwijder het
        if (typeof value === 'function') {
          delete cleanedSessionData[key];
        }
      });

      // Zorg ervoor dat de datum correct is
      if (!cleanedSessionData.createdAt) {
        cleanedSessionData.createdAt = new Date().toISOString();
      } else if (cleanedSessionData.createdAt instanceof Date) {
        cleanedSessionData.createdAt = cleanedSessionData.createdAt.toISOString();
      }

      // Vereenvoudig de data om problemen te voorkomen
      const simplifiedData = {
        userInput: cleanedSessionData.userInput || '',
        coachResponse: cleanedSessionData.coachResponse || '',
        selectedDuration: cleanedSessionData.selectedDuration ? {
          id: cleanedSessionData.selectedDuration.id,
          label: cleanedSessionData.selectedDuration.label
        } : null,
        selectedCoachingType: cleanedSessionData.selectedCoachingType ? {
          id: cleanedSessionData.selectedCoachingType.id,
          label: cleanedSessionData.selectedCoachingType.label
        } : null,
        selectedDiscType: cleanedSessionData.selectedDiscType ? {
          id: cleanedSessionData.selectedDiscType.id,
          label: cleanedSessionData.selectedDiscType.label
        } : null,
        selectedMusic: cleanedSessionData.selectedMusic ? {
          id: cleanedSessionData.selectedMusic.id,
          label: cleanedSessionData.selectedMusic.label
        } : null,
        selectedPersona: cleanedSessionData.selectedPersona,
        createdAt: cleanedSessionData.createdAt || new Date().toISOString()
      };

      console.log('Simplified session data:', simplifiedData);

      try {
        // Als er al een huidige sessie is, update deze
        if (currentSession) {
          console.log('Updating existing session:', currentSession.id);
          await updateCurrentSession(simplifiedData);
        } else {
          // Anders maak een nieuwe sessie aan
          console.log('Creating new session');
          await createNewSession(simplifiedData);
        }

        // Zorg ervoor dat de saving state wordt gereset
        setSaving(false);

        // Toon het succes bericht
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);

        // Roep de success callback aan
        onSaveSuccess();

        return true; // Geef aan dat het opslaan is gelukt
      } catch (innerError) {
        console.error('Inner error saving session:', innerError);
        throw innerError; // Gooi de fout door naar de outer catch
      }
    } catch (error) {
      console.error('Error saving session:', error);
      onSaveError(`Er is een fout opgetreden bij het opslaan van de sessie: ${error.message}`);
      setSaving(false); // Zorg ervoor dat de saving state wordt gereset bij een fout
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="save-session-container">
      <button
        className={`save-session-button ${disabled || saving ? 'disabled' : ''}`}
        onClick={handleSave}
        disabled={disabled || saving}
      >
        {saving ? (
          <>
            <div className="save-spinner"></div>
            Opslaan...
          </>
        ) : currentSession ? (
          'Sessie bijwerken'
        ) : (
          'Sessie opslaan'
        )}
      </button>

      {showSaveSuccess && (
        <div className="save-success-message">
          Sessie succesvol opgeslagen!
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

export default SaveSessionButton;
