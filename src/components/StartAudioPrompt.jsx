import { useState } from 'react';
import '../styles/StartAudioPrompt.css';

const StartAudioPrompt = ({ onStart }) => {
  const [visible, setVisible] = useState(true);

  const handleStart = () => {
    onStart();
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="start-audio-overlay">
      <div className="start-audio-prompt">
        <h2>Welkom bij Mindfulness Coach</h2>
        <p>Klik op de knop hieronder om de achtergrondmuziek te starten en de sessie te beginnen.</p>
        <button className="start-button" onClick={handleStart}>
          Start Sessie
        </button>
      </div>
    </div>
  );
};

export default StartAudioPrompt;
