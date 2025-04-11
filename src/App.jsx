import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import './App.css';
import './styles/StatusBar.css';

// Auth and Session Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';

// Components
import InstallPrompt from './components/InstallPrompt';
import SessionSettings from './components/SessionSettings';
import CoachForm from './components/CoachForm';
import ResponseContainer from './components/ResponseContainer';
import AdminPanel from './components/AdminPanel';
// StartAudioPrompt removed
import DiscSelector from './components/DiscSelector';
import UserMenu from './components/UserMenu';
import SaveSessionButton from './components/SaveSessionButton';
import MySessionsButton from './components/MySessionsButton';

// Services
import { generateResponse } from './services/ollamaService';

// Constants
import {
  getDefaultDuration,
  getDefaultCoachingType,
  getDefaultDiscType,
  getDefaultMusic,
  getDefaultPersona,
  DEFAULT_PERSONAS,
  DURATIONS,
  COACHING_TYPES,
  DISC_TYPES,
  MUSIC_TYPES
} from './services/constants';

function App() {
  // Auth state
  const { isAuthenticated, currentUser } = useAuth();

  // Admin state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [personas, setPersonas] = useState(() => {
    // Load personas from localStorage or use defaults
    const savedPersonas = localStorage.getItem('mindfulness-coach-personas');
    return savedPersonas ? JSON.parse(savedPersonas) : DEFAULT_PERSONAS;
  });
  const [selectedPersona, setSelectedPersona] = useState(getDefaultPersona());

  // Session settings state
  const [selectedDuration, setSelectedDuration] = useState(getDefaultDuration());
  const [selectedCoachingType, setSelectedCoachingType] = useState(getDefaultCoachingType());
  const [selectedDiscType, setSelectedDiscType] = useState(getDefaultDiscType());
  const [selectedMusic, setSelectedMusic] = useState(getDefaultMusic());
  // Music state variables removed

  // Function to get the appropriate coach based on DISC type
  const getCoachForDiscType = (discType) => {
    switch (discType.id) {
      case 'dominant':
        return personas.find(p => p.id === 'red-coach') || personas[0];
      case 'influential':
        return personas.find(p => p.id === 'yellow-coach') || personas[0];
      case 'steady':
        return personas.find(p => p.id === 'green-coach') || personas[0];
      case 'conscientious':
        return personas.find(p => p.id === 'blue-coach') || personas[0];
      default:
        return personas[0];
    }
  };

  // User input and response state
  const [userInput, setUserInput] = useState('');
  const [coachResponse, setCoachResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Audio initialization state
  // Zet audioStarted standaard op true om het welkomstscherm te verbergen
  const [audioStarted, setAudioStarted] = useState(true);

  // Save personas to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mindfulness-coach-personas', JSON.stringify(personas));
  }, [personas]);

  // Update selected persona when DISC type changes
  useEffect(() => {
    const appropriateCoach = getCoachForDiscType(selectedDiscType);
    setSelectedPersona(appropriateCoach);
  }, [selectedDiscType, personas]);

  // Handle admin mode toggle
  const handleAdminToggle = () => {
    setIsAdminMode(!isAdminMode);
  };

  // Reset personas to defaults
  const resetPersonas = () => {
    if (window.confirm('Weet je zeker dat je alle persona\'s wilt resetten naar de standaardwaarden? Dit kan niet ongedaan worden gemaakt.')) {
      localStorage.removeItem('mindfulness-coach-personas');
      setPersonas(DEFAULT_PERSONAS);
      alert('Persona\'s zijn gereset naar de standaardwaarden.');
    }
  };

  // Handle persona selection
  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
  };

  // Handle adding a new persona
  const handleAddPersona = (newPersona) => {
    setPersonas([...personas, newPersona]);
  };

  // Handle updating an existing persona
  const handleUpdatePersona = (updatedPersona) => {
    setPersonas(personas.map(p =>
      p.id === updatedPersona.id ? updatedPersona : p
    ));

    // Update selected persona if it was the one that was updated
    if (selectedPersona.id === updatedPersona.id) {
      setSelectedPersona(updatedPersona);
    }
  };

  // Handle deleting a persona
  const handleDeletePersona = (personaId) => {
    // Don't delete if it's the last persona
    if (personas.length <= 1) return;

    // Don't delete if it's the selected persona
    if (selectedPersona.id === personaId) return;

    setPersonas(personas.filter(p => p.id !== personaId));
  };

  // Handle form submission
  const handleSubmit = async (input) => {
    setUserInput(input);
    setIsLoading(true);
    setError('');

    try {
      const response = await generateResponse(
        input,
        selectedPersona,
        selectedCoachingType,
        selectedDiscType,
        selectedDuration.id
      );

      setCoachResponse(response);
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Er is een fout opgetreden bij het genereren van de coaching tekst. Controleer of Ollama draait en probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified function to handle user interaction (no audio needed)
  const handleUserInteraction = () => {
    // Mark as started immediately
    setAudioStarted(true);
  };

  // Simplified music toggle function (does nothing)
  const handleToggleMusic = () => {
    console.log('Music functionality has been removed');
  };

  // Simplified useEffect without audio initialization
  useEffect(() => {
    // Set audio started to true immediately
    setAudioStarted(true);

    // Clean up function (empty)
    return () => {};
  }, []);

  return (
    <div className="app">
      {/* StartAudioPrompt removed */}
      <InstallPrompt />

      <header className="app-header">
        <h1 className="app-title">Mindfulness Coach</h1>
        <div className="header-actions">
          <UserMenu />
          {isAuthenticated && currentUser && currentUser.email === 'patrick.van.zandvoort@gmail.com' && (
            <button
              className={`admin-toggle ${isAdminMode ? 'active' : ''}`}
              onClick={handleAdminToggle}
            >
              {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
            </button>
          )}
        </div>
      </header>

      {isAdminMode ? (
        <AdminPanel
          personas={personas}
          selectedPersona={selectedPersona}
          onSelectPersona={handleSelectPersona}
          onAddPersona={handleAddPersona}
          onUpdatePersona={handleUpdatePersona}
          onDeletePersona={handleDeletePersona}
          onResetPersonas={resetPersonas}
        />
      ) : (
        <div className="main-content">
          {/* DISC type selector - prominently displayed */}
          <DiscSelector
            selectedDiscType={selectedDiscType}
            onDiscTypeChange={setSelectedDiscType}
          />

          {/* Simple settings bar with buttons */}
          <div className="simple-settings-bar">
            {/* Duration settings */}
            <div className="settings-group">
              <div className="settings-header">Duur</div>
              <div className="settings-buttons">
                {DURATIONS.map(duration => (
                  <button
                    key={duration.id}
                    className={`setting-button ${selectedDuration.id === duration.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coaching type settings */}
            <div className="settings-group">
              <div className="settings-header">Type</div>
              <div className="settings-buttons">
                {COACHING_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`setting-button ${selectedCoachingType.id === type.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCoachingType(type)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DISC type settings moved to top of page */}

            {/* Music settings removed */}
          </div>

          {/* Hidden settings component to maintain functionality */}
          <div style={{ display: 'none' }}>
            <SessionSettings
              selectedDuration={selectedDuration}
              selectedCoachingType={selectedCoachingType}
              selectedDiscType={selectedDiscType}
              selectedMusic={selectedMusic}
              onDurationChange={setSelectedDuration}
              onCoachingTypeChange={setSelectedCoachingType}
              onDiscTypeChange={setSelectedDiscType}
              onMusicChange={setSelectedMusic}
            />
          </div>

          <CoachForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <div className="session-actions">
            <SaveSessionButton
              sessionData={{
                userInput,
                coachResponse,
                selectedDuration,
                selectedCoachingType,
                selectedDiscType,
                selectedMusic,
                selectedPersona: selectedPersona?.id,
                createdAt: new Date()
              }}
              disabled={!coachResponse || isLoading}
            />
            {isAuthenticated && (
              <MySessionsButton
                onLoadSession={(session) => {
                  // Laad alle sessie-instellingen
                  if (session.selectedDuration) setSelectedDuration(session.selectedDuration);
                  if (session.selectedCoachingType) setSelectedCoachingType(session.selectedCoachingType);
                  if (session.selectedDiscType) setSelectedDiscType(session.selectedDiscType);
                  if (session.selectedMusic) {
                    setSelectedMusic(session.selectedMusic);
                    // No audio functionality needed
                  }
                  if (session.userInput) setUserInput(session.userInput);
                  if (session.coachResponse) setCoachResponse(session.coachResponse);
                }}
              />
            )}
          </div>

          <ResponseContainer
            response={coachResponse}
            isLoading={isLoading}
            error={error}
          />

          <footer className="app-footer">
            <p className="version-info">Mindfulness Coach v1.3.0</p>
          </footer>
        </div>
      )}
    </div>
  );
}

// Wrap App component with AuthProvider and SessionProvider
const AppWithProviders = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </AuthProvider>
  );
};

export default AppWithProviders;
