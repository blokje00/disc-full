import { useState } from 'react';
import PersonaEditor from './PersonaEditor';
import '../styles/AdminPanel.css';

const AdminPanel = ({
  personas,
  selectedPersona,
  onSelectPersona,
  onAddPersona,
  onUpdatePersona,
  onDeletePersona,
  onResetPersonas
}) => {
  const [editingPersona, setEditingPersona] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Handle edit button click
  const handleEdit = (persona) => {
    setEditingPersona(persona);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    setEditingPersona(null);
    setIsCreating(true);
  };

  // Handle save from editor
  const handleSave = (persona) => {
    if (isCreating) {
      onAddPersona(persona);
    } else {
      onUpdatePersona(persona);
    }
    setEditingPersona(null);
    setIsCreating(false);
  };

  // Handle cancel from editor
  const handleCancel = () => {
    setEditingPersona(null);
    setIsCreating(false);
  };

  // Handle delete button click
  const handleDelete = (persona) => {
    if (window.confirm(`Weet je zeker dat je "${persona.name}" wilt verwijderen?`)) {
      onDeletePersona(persona.id);
    }
  };

  // If editing or creating, show the editor
  if (editingPersona || isCreating) {
    return (
      <PersonaEditor
        persona={editingPersona}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  // Otherwise show the list of personas
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Coach Persona's</h2>
        <div className="admin-buttons">
          <button className="reset-button" onClick={onResetPersonas}>
            Reset naar standaard
          </button>
          <button className="create-button" onClick={handleCreate}>
            Nieuwe Persona
          </button>
        </div>
      </div>

      <div className="personas-list">
        {personas.map(persona => (
          <div
            key={persona.id}
            className={`persona-item ${selectedPersona.id === persona.id ? 'selected' : ''}`}
          >
            <div className="persona-info">
              <h3>{persona.name}</h3>
              <p>{persona.description}</p>
            </div>

            <div className="persona-actions">
              <button
                className="select-button"
                onClick={() => onSelectPersona(persona)}
                disabled={selectedPersona.id === persona.id}
              >
                {selectedPersona.id === persona.id ? 'Actief' : 'Selecteren'}
              </button>

              <button
                className="edit-button"
                onClick={() => handleEdit(persona)}
              >
                Bewerken
              </button>

              <button
                className="delete-button"
                onClick={() => handleDelete(persona)}
                disabled={personas.length <= 1 || selectedPersona.id === persona.id}
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
