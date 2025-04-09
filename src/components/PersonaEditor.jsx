import { useState, useEffect } from 'react';
import '../styles/PersonaEditor.css';

const PersonaEditor = ({ persona, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form with persona data if editing
  useEffect(() => {
    if (persona) {
      setName(persona.name || '');
      setDescription(persona.description || '');
      setSystemPrompt(persona.systemPrompt || '');
    }
  }, [persona]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Beschrijving is verplicht';
    }
    
    if (!systemPrompt.trim()) {
      newErrors.systemPrompt = 'Systeemprompt is verplicht';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedPersona = {
        id: persona?.id || `persona-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        systemPrompt: systemPrompt.trim()
      };
      
      onSave(updatedPersona);
    }
  };

  return (
    <div className="persona-editor">
      <h2>{persona ? 'Bewerk Persona' : 'Nieuwe Persona'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Naam</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Beschrijving</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="systemPrompt">Systeemprompt</label>
          <textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className={errors.systemPrompt ? 'error' : ''}
          />
          {errors.systemPrompt && <div className="error-message">{errors.systemPrompt}</div>}
          <div className="help-text">
            Gedetailleerde instructies voor het LLM over hoe te coachen. Dit bepaalt de stijl en toon van de coaching.
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Annuleren
          </button>
          <button type="submit" className="save-button">
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonaEditor;
