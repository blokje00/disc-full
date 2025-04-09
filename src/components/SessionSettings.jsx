import { useState } from 'react';
import { DURATIONS, COACHING_TYPES, DISC_TYPES, MUSIC_TYPES } from '../services/constants';
import '../styles/SessionSettings.css';

const SessionSettings = ({ 
  selectedDuration, 
  selectedCoachingType, 
  selectedDiscType, 
  selectedMusic,
  isMusicPlaying,
  onDurationChange, 
  onCoachingTypeChange, 
  onDiscTypeChange, 
  onMusicChange,
  onToggleMusic
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="session-settings">
      <div className="settings-section">
        <div 
          className={`settings-header ${expandedSection === 'duration' ? 'expanded' : ''}`}
          onClick={() => toggleSection('duration')}
        >
          <h3>Sessieduur: {selectedDuration.label}</h3>
          <span className="toggle-icon">{expandedSection === 'duration' ? '▼' : '▶'}</span>
        </div>
        
        {expandedSection === 'duration' && (
          <div className="settings-content">
            <div className="duration-buttons">
              {DURATIONS.map(duration => (
                <button
                  key={duration.id}
                  className={`duration-button ${selectedDuration.id === duration.id ? 'selected' : ''}`}
                  onClick={() => onDurationChange(duration)}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div 
          className={`settings-header ${expandedSection === 'coaching' ? 'expanded' : ''}`}
          onClick={() => toggleSection('coaching')}
        >
          <h3>Coaching Type: {selectedCoachingType.label}</h3>
          <span className="toggle-icon">{expandedSection === 'coaching' ? '▼' : '▶'}</span>
        </div>
        
        {expandedSection === 'coaching' && (
          <div className="settings-content">
            <div className="coaching-type-buttons">
              {COACHING_TYPES.map(coachingType => (
                <button
                  key={coachingType.id}
                  className={`coaching-type-button ${selectedCoachingType.id === coachingType.id ? 'selected' : ''}`}
                  onClick={() => onCoachingTypeChange(coachingType)}
                >
                  {coachingType.label}
                </button>
              ))}
            </div>
            <div className="coaching-type-description">
              {selectedCoachingType.description}
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div 
          className={`settings-header ${expandedSection === 'disc' ? 'expanded' : ''}`}
          onClick={() => toggleSection('disc')}
        >
          <h3>DISC Type: {selectedDiscType.label}</h3>
          <span className="toggle-icon">{expandedSection === 'disc' ? '▼' : '▶'}</span>
        </div>
        
        {expandedSection === 'disc' && (
          <div className="settings-content">
            <div className="disc-type-buttons">
              {DISC_TYPES.map(discType => (
                <button
                  key={discType.id}
                  className={`disc-type-button ${selectedDiscType.id === discType.id ? 'selected' : ''}`}
                  onClick={() => onDiscTypeChange(discType)}
                  style={{
                    borderColor: discType.color,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    backgroundColor: selectedDiscType.id === discType.id ? discType.color : 'transparent',
                    color: selectedDiscType.id === discType.id ? 'white' : 'black'
                  }}
                >
                  {discType.label}
                </button>
              ))}
            </div>
            <div className="disc-type-description">
              {selectedDiscType.description}
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div 
          className={`settings-header ${expandedSection === 'music' ? 'expanded' : ''}`}
          onClick={() => toggleSection('music')}
        >
          <h3>Achtergrondmuziek: {selectedMusic.label}</h3>
          <span className="toggle-icon">{expandedSection === 'music' ? '▼' : '▶'}</span>
        </div>
        
        {expandedSection === 'music' && (
          <div className="settings-content">
            <div className="music-type-buttons">
              {MUSIC_TYPES.map(musicType => (
                <button
                  key={musicType.id}
                  className={`music-type-button ${selectedMusic.id === musicType.id ? 'selected' : ''}`}
                  onClick={() => onMusicChange(musicType)}
                >
                  {musicType.label}
                </button>
              ))}
            </div>
            <div className="music-type-description">
              {selectedMusic.description}
            </div>
            {selectedMusic.id !== 'none' && (
              <button 
                className={`music-toggle-button ${isMusicPlaying ? 'playing' : ''}`}
                onClick={onToggleMusic}
              >
                {isMusicPlaying ? 'Pause Music' : 'Play Music'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSettings;
