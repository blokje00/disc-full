// Test script voor ollamaService

// Simuleer de benodigde parameters
const persona = {
  systemPrompt: 'Je bent een ervaren mindfulness coach die mensen begeleidt in meditatie, ademhalingsoefeningen en bodyscans.'
};

const coachingType = {
  id: 'breathing',
  label: 'Ademhaling'
};

const discType = {
  id: 'steady',
  label: 'Stabiel (Groen)'
};

const duration = 5;

// Importeer de generateResponse functie
import('./src/services/ollamaService.js')
  .then(module => {
    const { generateResponse } = module;
    
    // Test de functie
    console.log('Testing ollamaService with Cogito:3b...');
    
    generateResponse(
      'Help me ontspannen na een drukke dag',
      persona,
      coachingType,
      discType,
      duration
    )
      .then(response => {
        console.log('Cogito:3b response:', response);
        console.log('Test successful!');
      })
      .catch(error => {
        console.error('Error testing ollamaService:', error);
      });
  })
  .catch(error => {
    console.error('Error importing ollamaService:', error);
  });
