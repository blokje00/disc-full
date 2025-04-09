import { useState } from 'react';
import '../styles/CoachForm.css';

const CoachForm = ({ onSubmit, isLoading }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onSubmit(userInput.trim());
    }
  };

  return (
    <form className="coach-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Stel een vraag of deel een gedachte..."
          disabled={isLoading}
          rows={3}
        />
      </div>
      <button 
        type="submit" 
        className="submit-button"
        disabled={!userInput.trim() || isLoading}
      >
        {isLoading ? 'Bezig...' : 'Start Coaching'}
      </button>
    </form>
  );
};

export default CoachForm;
