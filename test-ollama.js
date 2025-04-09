// Test script voor Ollama integratie

async function testOllama() {
  try {
    console.log('Testing Ollama connection...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: 'Give me a short mindfulness exercise in 3 sentences.',
        stream: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Ollama response:', data.response);
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing Ollama:', error);
  }
}

// Run the test
testOllama();
