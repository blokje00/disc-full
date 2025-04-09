// Audio context for generating sounds
let audioContext = null;
let currentSound = null;
let gainNode = null;
let audioInitialized = false;
let pendingMusicType = null;

// Initialize audio context (must be called after user interaction)
export const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioInitialized = true;
      console.log('Audio context initialized successfully');

      // If there was a pending music type, start it now
      if (pendingMusicType) {
        const musicType = pendingMusicType;
        pendingMusicType = null;
        startMusicByType(musicType);
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }
  return audioContext;
};

// Check if audio is initialized
export const isAudioInitialized = () => {
  return audioInitialized;
};

// Start music by type
export const startMusicByType = (musicType) => {
  // If audio is not initialized yet, store the music type for later
  if (!audioInitialized) {
    pendingMusicType = musicType;
    console.log('Audio not initialized yet, storing music type for later:', musicType);
    return null;
  }

  // Stop any current sound
  if (currentSound) {
    currentSound.stop();
  }

  // Start new sound based on selection
  let sound;
  switch (musicType) {
    case 'calm':
      sound = createCalmMeditationSound();
      break;
    case 'ocean':
      sound = createOceanSound();
      break;
    case 'forest':
      sound = createForestSound();
      break;
    default:
      return null; // No music selected
  }

  return sound;
};

// Create pink noise for calm meditation
const createPinkNoise = (context) => {
  const bufferSize = 4096;
  const pinkNoiseNode = context.createScriptProcessor(bufferSize, 1, 1);

  // Pink noise algorithm
  let b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

  pinkNoiseNode.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;

      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // Scale to keep in range [-1, 1]

      b6 = white * 0.115926;
    }
  };

  return pinkNoiseNode;
};

// Create white noise for ocean waves
const createWhiteNoise = (context) => {
  const bufferSize = 4096;
  const whiteNoiseNode = context.createScriptProcessor(bufferSize, 1, 1);

  whiteNoiseNode.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  };

  return whiteNoiseNode;
};

// Create green noise for forest ambience
const createGreenNoise = (context) => {
  const bufferSize = 4096;
  const greenNoiseNode = context.createScriptProcessor(bufferSize, 1, 1);

  greenNoiseNode.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Base white noise
      let noise = Math.random() * 2 - 1;

      // Apply filtering to emphasize mid frequencies (green noise)
      noise = noise * 0.5;

      output[i] = noise;
    }
  };

  return greenNoiseNode;
};

// Create random bird chirps for forest ambience
const createBirdChirps = (context) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 0;

  gainNode.gain.value = 0;

  oscillator.connect(gainNode);
  oscillator.start();

  // Schedule random bird chirps
  const scheduleBirdChirps = () => {
    const chirpFrequency = 2000 + Math.random() * 2000;
    const chirpTime = context.currentTime + Math.random() * 5;
    const chirpDuration = 0.1 + Math.random() * 0.2;

    oscillator.frequency.setValueAtTime(chirpFrequency, chirpTime);
    gainNode.gain.setValueAtTime(0, chirpTime);
    gainNode.gain.linearRampToValueAtTime(0.1, chirpTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, chirpTime + chirpDuration);

    // Schedule next chirp
    setTimeout(scheduleBirdChirps, (Math.random() * 5 + 2) * 1000);
  };

  scheduleBirdChirps();

  return gainNode;
};

// Create sound functions for each background music type
export const createCalmMeditationSound = () => {
  if (!audioContext) {
    initAudioContext();
  }

  // Stop any current sound
  if (currentSound) {
    currentSound.disconnect();
  }

  // Create pink noise
  const pinkNoise = createPinkNoise(audioContext);

  // Create filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  // Create gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5;

  // Connect nodes
  pinkNoise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  currentSound = pinkNoise;

  return {
    stop: () => {
      if (currentSound) {
        currentSound.disconnect();
        currentSound = null;
      }
    }
  };
};

export const createOceanSound = () => {
  if (!audioContext) {
    initAudioContext();
  }

  // Stop any current sound
  if (currentSound) {
    currentSound.disconnect();
  }

  // Create white noise
  const whiteNoise = createWhiteNoise(audioContext);

  // Create filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;

  // Create LFO for wave effect
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();

  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // Slow modulation
  lfoGain.gain.value = 200; // Modulation depth

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // Create gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0.5;

  // Connect nodes
  whiteNoise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  currentSound = whiteNoise;

  return {
    stop: () => {
      if (currentSound) {
        lfo.stop();
        currentSound.disconnect();
        currentSound = null;
      }
    }
  };
};

export const createForestSound = () => {
  if (!audioContext) {
    initAudioContext();
  }

  // Stop any current sound
  if (currentSound) {
    currentSound.disconnect();
  }

  // Create green noise
  const greenNoise = createGreenNoise(audioContext);

  // Create filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  // Create bird chirps
  const birdChirps = createBirdChirps(audioContext);

  // Create gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.gain.value = 0.3;

  // Connect nodes
  greenNoise.connect(filter);
  filter.connect(gainNode);
  birdChirps.connect(gainNode);
  gainNode.connect(audioContext.destination);

  currentSound = greenNoise;

  return {
    stop: () => {
      if (currentSound) {
        currentSound.disconnect();
        currentSound = null;
      }
    }
  };
};

// Set volume
export const setVolume = (volume) => {
  if (gainNode) {
    gainNode.gain.value = volume;
  }
};

// Stop all sounds
export const stopAllSounds = () => {
  if (currentSound) {
    currentSound.disconnect();
    currentSound = null;
  }
};
