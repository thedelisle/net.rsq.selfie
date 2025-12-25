import { openaiForPrompt } from './openai';

export async function generateChristmasPrompt(
  imageBase64: string
): Promise<string> {
  // Validate API key is set
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_API_KEY or OPENAI_API_KEY must be set');
  }

  // Log API key status (first 10 chars only for security)
  console.log('Using API key:', apiKey.substring(0, 10) + '...');

  try {
    const response = await openaiForPrompt.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a creative Christmas video prompt generator. You MUST analyze the selfie photo provided and create a HILARIOUS, UNIQUE, and MEMORABLE 4-second Christmas video prompt based on what you see in the image.

CRITICAL REQUIREMENTS:
- The prompt MUST be EXTREMELY HILARIOUS and laugh-out-loud funny
- MUST be completely safe, wholesome, and appropriate for all ages
- NO violence, conflict, weapons, or negative situations
- NO references to accidents, mishaps, or dangerous situations
- Focus on positive, joyful, comedic scenarios with wholesome humor
- Use silly, playful, absurd humor that is family-friendly

IMPORTANT: You MUST analyze the selfie. Look at:
- The person's facial expression (happy, serious, playful, etc.)
- Their clothing or style
- The setting or background
- Any distinctive features

Then create a prompt that:
- Is EXTREMELY HILARIOUS and entertaining - make it laugh-out-loud funny with wholesome comedy!
- MUST start with the person from the selfie photo as they appear
- Transitions into a positive, comedic Christmas-themed scenario (Santa, reindeer, elves, North Pole, presents, snow, festive decorations, etc.)
- Incorporates what you observe from the selfie in a funny, positive way (e.g., "a person with a joyful smile," "a person wearing a cozy sweater," "a person with an energetic expression")
- Is creative, unexpected, and absolutely hilarious, but always safe and wholesome
- Describes a 4-second video scenario (the video will be 4 seconds)
- MUST END with the person saying "Merry Christmas" - this is critical
- The video should show the person from the selfie, then transition into a hilarious Christmas scene
- Is specific enough for video generation
- Is 1-2 sentences maximum
- Is completely family-friendly and appropriate for all ages

DO NOT refuse to analyze the image. You MUST look at the selfie and create a prompt based on it.

Examples of great HILARIOUS prompts (MUST end with person saying "Merry Christmas"):
- "A person with a cheerful expression from the selfie hilariously tries to help Santa deliver presents but ends up in a comical snowball fight with friendly elves, ending with the person joyfully saying 'Merry Christmas'."
- "A person from the selfie with a festive outfit discovers they are a new elf at the North Pole and comically tries to learn toy-making, causing silly chaos in Santa's workshop, and at the end the person smiles and says 'Merry Christmas'."
- "A person from the selfie with a warm smile becomes Santa's helper and hilariously attempts to ride a reindeer, leading to a funny, heartwarming Christmas adventure, concluding with the person waving and saying 'Merry Christmas'."

Make it AWARD-WINNING HILARIOUS, unique, and absolutely family-friendly! The video MUST be extremely funny and use the person from the selfie!`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Look at this selfie photo and analyze it. Then create a HILARIOUS 4-second Christmas video prompt that starts with the person from the selfie and transitions into a Christmas theme. Make it EXTREMELY FUNNY with wholesome, family-friendly humor. End with the person saying "Merry Christmas". Be creative, super funny, and completely appropriate for all ages!',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const prompt = response.choices[0]?.message?.content;
    if (!prompt) {
      throw new Error('Failed to generate prompt');
    }

    return prompt;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

