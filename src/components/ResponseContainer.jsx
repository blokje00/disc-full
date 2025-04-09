import { useEffect, useState } from 'react';
import PlaybackControls from './PlaybackControls';
import '../styles/ResponseContainer.css';

const ResponseContainer = ({ response, isLoading, error, autoPlaySpeech = true }) => {
  // Track if this is a new response
  const [isNewResponse, setIsNewResponse] = useState(false);

  // When response changes, mark it as new
  useEffect(() => {
    if (response && !isLoading) {
      setIsNewResponse(true);
    }
  }, [response, isLoading]);
  return (
    <div className="response-container">
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Coaching sessie wordt gegenereerd...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <h3>Er is een fout opgetreden</h3>
          <p>{error}</p>
          <p>Probeer het opnieuw of controleer je internetverbinding.</p>
        </div>
      ) : response ? (
        <>
          {/* Hide the text response, only show audio controls */}
          <div className="audio-only-message">
            <p>Je coaching sessie wordt nu afgespeeld...</p>
          </div>
          <PlaybackControls
            text={response}
            autoPlay={isNewResponse && autoPlaySpeech}
          />
          {/* Reset isNewResponse after rendering with autoPlay */}
          {isNewResponse && setTimeout(() => setIsNewResponse(false), 1000) && null}
        </>
      ) : (
        <div className="empty-state">
          {/* Leeg, geen tekst tonen */}
        </div>
      )}
    </div>
  );
};

export default ResponseContainer;
