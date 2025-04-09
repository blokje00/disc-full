// Test script voor Ollama met Cogito:3b model

async function testCogito() {
  try {
    console.log('Testing Ollama with Cogito:3b model...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'cogito:3b',
        prompt: 'Give me a short mindfulness exercise in 3 sentences.',
        stream: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Cogito:3b response:', data.response);
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing Cogito:3b:', error);
  }
}

// Run the test
testCogito();
