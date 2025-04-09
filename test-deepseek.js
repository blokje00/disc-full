// Test script voor Deepseek integratie

const API_KEY = 'YOUR_DEEPSEEK_API_KEY'; // Replace with your own API key
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

async function testDeepseek() {
  try {
    console.log('Testing Deepseek connection...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a mindfulness coach.' },
          { role: 'user', content: 'Give me a short mindfulness exercise in 3 sentences.' }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Deepseek response:', data.choices[0].message.content);
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing Deepseek:', error);
  }
}

// Run the test
testDeepseek();
