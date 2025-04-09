// Test script voor OpenAI integratie

const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your own API key
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');

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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data.choices[0].message.content);
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing OpenAI:', error);
  }
}

// Run the test
testOpenAI();
