// Default model to use
const DEFAULT_MODEL = 'cogito:3b';

// Generate coaching response using Ollama
export const generateResponse = async (userInput, persona, coachingType, discType, duration, modelName = DEFAULT_MODEL) => {
  try {
    // Create system prompt based on persona, coaching type, and DISC type
    const systemPrompt = createSystemPrompt(persona, coachingType, discType, duration);

    // Format the user input
    const formattedInput = `[${duration} minutes ${coachingType} session | DISC: ${discType.label}] ${userInput}`;

    // Make API call to Ollama
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: formattedInput,
        system: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

// Create system prompt based on persona, coaching type, and DISC type
const createSystemPrompt = (persona, coachingType, discType, duration) => {
  // Base system prompt from persona
  let systemPrompt = persona.systemPrompt || '';

  // Add coaching type specific instructions
  const coachingTypeInstructions = getCoachingTypeInstructions(coachingType.id, duration);
  systemPrompt += '\n\n' + coachingTypeInstructions;

  // Add DISC type specific instructions
  const discTypeInstructions = getDiscTypeInstructions(discType.id);
  systemPrompt += '\n\n' + discTypeInstructions;

  // Add session structure instructions
  systemPrompt += '\n\n' + getSessionStructureInstructions(duration);

  return systemPrompt;
};

// Get coaching type specific instructions
const getCoachingTypeInstructions = (coachingType, duration) => {
  const instructions = {
    'bodyscan': `This is a ${duration}-minute Bodyscan session. Guide the user through a systematic body scan meditation, starting from the feet and moving upward to the head. Help them become aware of sensations in different parts of their body without judgment. Include pauses to allow them to feel each body part.`,
    'breathing': `This is a ${duration}-minute Breathing session. Guide the user through conscious breathing exercises. Include techniques like deep belly breathing, 4-7-8 breathing, or box breathing. Help them focus on their breath and use it as an anchor for their attention.`,
    'mindfulness': `This is a ${duration}-minute Mindfulness session. Guide the user in observing their thoughts and feelings without judgment. Help them develop present moment awareness and acceptance. Include techniques for noticing thoughts without getting caught up in them.`
  };

  return instructions[coachingType] || '';
};

// Get DISC type specific instructions
const getDiscTypeInstructions = (discType) => {
  const instructions = {
    'dominant': 'The user has a Dominant (Red) personality type. Adapt your coaching style to be direct, focused on results, and efficient. Use concise language, get to the point quickly, and emphasize how the practice will help them achieve their goals. Avoid unnecessary details and focus on the benefits.',
    'influential': 'The user has an Influential (Yellow) personality type. Adapt your coaching style to be enthusiastic, social, and optimistic. Use expressive language, be conversational, and emphasize how the practice will help them feel good and connect with others. Include some light humor and keep the tone upbeat.',
    'steady': 'The user has a Steady (Green) personality type. Adapt your coaching style to be patient, supportive, and reliable. Use warm language, be gentle in your guidance, and emphasize how the practice will help them maintain balance and harmony. Take time to reassure them and create a safe space.',
    'conscientious': 'The user has a Conscientious (Blue) personality type. Adapt your coaching style to be logical, detailed, and precise. Use structured language, provide clear steps, and emphasize how the practice is backed by research. Include specific details about the technique and its benefits.'
  };

  return instructions[discType] || '';
};

// Get session structure instructions
const getSessionStructureInstructions = (duration) => {
  return `
Session Structure:
1. First play the chosen background music for 5 seconds (no greeting)
2. Provide a brief mindful response to the user's question (max 3 sentences)
3. Transition into the guided practice
4. Main practice (appropriate length for a ${duration}-minute session)
5. Closing with 15 seconds of just background music (no reflection or encouragement for future sessions)

Keep the entire session to approximately ${duration} minutes when read aloud at a normal pace.
`;
};
