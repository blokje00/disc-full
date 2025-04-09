import { useState, useEffect, useRef } from 'react';
import '../styles/PlaybackControls.css';

const PlaybackControls = ({ text, autoPlay = false }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState(null);

  // Use refs to keep track of current utterance and synthesis
  const utteranceRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;

      // Load voices function
      const loadVoices = () => {
        const allVoices = synthRef.current.getVoices();
        console.log('All available voices:', allVoices);

        // Filter for only the specific Dutch voices we want
        const preferredVoices = allVoices.filter(voice =>
          voice.name.includes('Xander') ||
          (voice.name.includes('Google') && voice.lang.includes('nl'))
        );

        // If preferred voices not found, fallback to any Dutch voice
        const availableVoices = preferredVoices.length > 0 ?
          preferredVoices :
          allVoices.filter(voice => voice.lang.includes('nl'));

        console.log('Filtered voices:', availableVoices);
        setVoices(availableVoices);

        // Set default voice (prefer Xander, then Google Nederlands)
        if (availableVoices.length > 0) {
          const xanderVoice = availableVoices.find(voice => voice.name.includes('Xander'));
          const googleDutchVoice = availableVoices.find(voice =>
            voice.name.includes('Google') && voice.lang.includes('nl')
          );
          setSelectedVoice(xanderVoice || googleDutchVoice || availableVoices[0]);
        }
      };

      // Initial load attempt
      loadVoices();

      // Some browsers load voices asynchronously
      synthRef.current.onvoiceschanged = loadVoices;

      return () => {
        if (synthRef.current) {
          synthRef.current.onvoiceschanged = null;
        }
      };
    } else {
      setError('Speech synthesis is not supported in this browser');
    }
  }, []);

  // Auto-play effect
  useEffect(() => {
    // Only auto-play if the feature is enabled, we have text, and a voice is selected
    if (autoPlay && text && selectedVoice && !speaking) {
      console.log('Auto-playing speech...');
      // Use a small timeout to ensure the UI has updated
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [text, selectedVoice, autoPlay, speaking]);

  // Filter text to remove lines starting with * and any instructions in parentheses
  const filterInstructionText = (text) => {
    if (!text) return '';

    // Split by newlines and filter out lines starting with *
    const lines = text.split('\n');
    const filteredLines = lines.filter(line => !line.trim().startsWith('*'));

    // Join the lines back together
    let filteredText = filteredLines.join('\n');

    // Also remove any text between asterisks like *this*
    filteredText = filteredText.replace(/\*[^\*]+\*/g, '');

    // Also remove any text between parentheses like (this)
    filteredText = filteredText.replace(/\([^\)]+\)/g, '');

    // Clean up any double spaces or newlines that might have been created
    filteredText = filteredText.replace(/\s+/g, ' ').trim();

    return filteredText;
  };

  // Handle play button click
  const handlePlay = () => {
    if (!selectedVoice || !text || !synthRef.current) return;

    if (paused) {
      // Resume if paused
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setPaused(false);
        setSpeaking(true);
      }
    } else {
      // Cancel any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      // Filter the text to remove instructions
      const filteredText = filterInstructionText(text);

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(filteredText);
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Set up event handlers
      utterance.onstart = () => {
        console.log('Speech started');
        setSpeaking(true);
        setPaused(false);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
        setError(`Speech synthesis error: ${event.error}`);
      };

      // Save reference to current utterance
      utteranceRef.current = utterance;

      // Start speaking
      try {
        synthRef.current.speak(utterance);
        console.log('Speaking with voice:', selectedVoice.name);
      } catch (err) {
        console.error('Failed to start speech:', err);
        setError(`Failed to start speech: ${err.message}`);
      }
    }
  };

  // Handle pause button click
  const handlePause = () => {
    if (synthRef.current && synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setPaused(true);
      console.log('Speech paused');
    }
  };

  // Handle stop button click
  const handleStop = () => {
    if (synthRef.current && (synthRef.current.speaking || synthRef.current.paused)) {
      synthRef.current.cancel();
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
      console.log('Speech stopped');
    }
  };

  // Handle voice change
  const handleVoiceChange = (e) => {
    const voiceURI = e.target.value;
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voice);
      console.log('Voice changed to:', voice.name);

      // Stop current speech if speaking
      if (speaking && synthRef.current) {
        synthRef.current.cancel();
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      }
    }
  };

  // Handle rate change
  const handleRateChange = (e) => {
    setRate(parseFloat(e.target.value));
  };

  // Handle pitch change
  const handlePitchChange = (e) => {
    setPitch(parseFloat(e.target.value));
  };

  return (
    <div className="playback-controls">
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="control-buttons">
        {!speaking || paused ? (
          <button
            className="play-button"
            onClick={handlePlay}
            disabled={!selectedVoice || !text}
          >
            {paused ? 'Hervatten' : 'Afspelen'}
          </button>
        ) : (
          <button
            className="pause-button"
            onClick={handlePause}
          >
            Pauzeren
          </button>
        )}

        <button
          className="stop-button"
          onClick={handleStop}
          disabled={!speaking}
        >
          Stoppen
        </button>
      </div>

      {/* Voice settings are hidden, but still functional in the background */}
      <div className="voice-settings" style={{ display: 'none' }}>
        <div className="voice-selector">
          <label htmlFor="voice-select">Stem:</label>
          <select
            id="voice-select"
            value={selectedVoice?.voiceURI || ''}
            onChange={handleVoiceChange}
          >
            {voices.length === 0 ? (
              <option value="">Laden van stemmen...</option>
            ) : (
              voices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {speaking && (
        <div className="speech-status">
          <p>{paused ? 'Gepauzeerd...' : 'Spreekt...'}</p>
        </div>
      )}
    </div>
  );
};

export default PlaybackControls;
