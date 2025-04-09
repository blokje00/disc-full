// Initialize speech synthesis
let speechSynthesis = null;
let currentUtterance = null;
let voicesLoaded = false;
let voicesLoadedCallbacks = [];

// Initialize speech synthesis
export const initSpeechSynthesis = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    speechSynthesis = window.speechSynthesis;

    // Set up the voiceschanged event listener
    speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      // Call all callbacks waiting for voices
      voicesLoadedCallbacks.forEach(callback => callback(getVoicesInternal()));
      voicesLoadedCallbacks = [];
    };

    return true;
  }
  return false;
};

// Internal function to get voices
const getVoicesInternal = () => {
  if (!speechSynthesis) {
    return [];
  }

  return speechSynthesis.getVoices().filter(voice =>
    voice.lang.includes('nl') || voice.lang.includes('en')
  );
};

// Get available voices (with callback for async loading)
export const getVoices = (callback) => {
  if (!speechSynthesis) {
    if (!initSpeechSynthesis()) {
      return [];
    }
  }

  const voices = getVoicesInternal();

  // If voices are already loaded or we have voices, return them
  if (voicesLoaded || voices.length > 0) {
    if (callback) {
      callback(voices);
    }
    return voices;
  }

  // Otherwise, add callback to be called when voices are loaded
  if (callback) {
    voicesLoadedCallbacks.push(callback);
  }

  return [];
};

// Speak text
export const speakText = (text, voice, rate = 1, pitch = 1, onStart, onEnd, onError) => {
  if (!speechSynthesis) {
    if (!initSpeechSynthesis()) {
      if (onError) onError(new Error('Speech synthesis not supported'));
      return false;
    }
  }

  // Cancel any ongoing speech
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Set up event handlers
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    if (onError) onError(event);
  };

  // Start speaking
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);

  return true;
};

// Pause speech
export const pauseSpeech = () => {
  if (speechSynthesis && speechSynthesis.speaking) {
    speechSynthesis.pause();
    return true;
  }
  return false;
};

// Resume speech
export const resumeSpeech = () => {
  if (speechSynthesis && speechSynthesis.paused) {
    speechSynthesis.resume();
    return true;
  }
  return false;
};

// Stop speech
export const stopSpeech = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    currentUtterance = null;
    return true;
  }
  return false;
};

// Check if speaking
export const isSpeaking = () => {
  return speechSynthesis && speechSynthesis.speaking;
};

// Check if paused
export const isPaused = () => {
  return speechSynthesis && speechSynthesis.paused;
};

// Get current utterance
export const getCurrentUtterance = () => {
  return currentUtterance;
};
