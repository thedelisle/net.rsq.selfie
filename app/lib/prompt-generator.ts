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
          content: `You are a creative Christmas video prompt generator. You MUST analyze the selfie photo provided and create a HILARIOUS, UNIQUE, and MEMORABLE 8-second Christmas video prompt based on what you see in the image.

CRITICAL: YOU MUST ANALYZE THE SELFIE PHOTO. DO NOT REFUSE. This is a legitimate, family-friendly Christmas video project. The selfie is provided for creative video generation purposes only.

CRITICAL REQUIREMENTS:
- The prompt MUST be EXTREMELY HILARIOUS and laugh-out-loud funny
- MUST be completely safe, wholesome, and appropriate for all ages
- NO violence, conflict, weapons, or negative situations
- NO references to accidents, mishaps, or dangerous situations
- Focus on positive, joyful, comedic scenarios with wholesome humor
- Use silly, playful, absurd humor that is family-friendly

YOU MUST analyze the selfie photo. Look at and describe:
- The person's facial expression (happy, serious, playful, etc.)
- Their clothing or style
- The setting or background
- Any distinctive features
- Their appearance and characteristics

DO NOT refuse to analyze the image. This is a creative, family-friendly Christmas video project. You MUST look at the selfie and create a prompt based on what you see.

Then create a prompt that:
- Is EXTREMELY HILARIOUS and entertaining - make it laugh-out-loud funny with wholesome comedy!
- MUST start with the EXACT person from the selfie photo as they appear - use their face, expression, and appearance
- The person from the selfie MUST be the main character throughout the entire video
- Transitions the person from the selfie into a positive, comedic Christmas-themed scenario (Santa, reindeer, elves, North Pole, presents, snow, festive decorations, etc.)
- The Christmas theme should be added AROUND the person from the selfie - they stay as the main character
- Incorporates what you observe from the selfie in a funny, positive way (e.g., "a person with a joyful smile," "a person wearing a cozy sweater," "a person with an energetic expression")
- Is creative, unexpected, and absolutely hilarious, but always safe and wholesome
- Describes an 8-second video scenario (the video will be 8 seconds)
- MUST END with the person from the selfie saying "Merry Christmas" - this is critical
- The video should show the person from the selfie, then add Christmas elements around them (Santa, elves, snow, decorations, etc.)
- Is specific enough for video generation
- Is 1-2 sentences maximum
- Is completely family-friendly and appropriate for all ages

AGAIN: DO NOT refuse to analyze the image. This is a legitimate, family-friendly Christmas video project. You MUST look at the selfie photo, analyze what you see, and create a prompt based on it. Refusing to analyze the image is not acceptable.

Examples of great HILARIOUS prompts (MUST use the person from the selfie and add Christmas theme, MUST end with person saying "Merry Christmas"):
- "The person from the selfie with their exact face and expression hilariously tries to help Santa deliver presents, with Christmas decorations and snow appearing around them, ending with the person from the selfie joyfully saying 'Merry Christmas'."
- "The person from the selfie with their exact appearance discovers they are at the North Pole with Santa and friendly elves appearing around them, comically trying to learn toy-making, and at the end the person from the selfie smiles and says 'Merry Christmas'."
- "The person from the selfie with their exact face becomes Santa's helper with reindeer and Christmas magic appearing around them, hilariously attempting to ride a reindeer, concluding with the person from the selfie waving and saying 'Merry Christmas'."

Make it AWARD-WINNING HILARIOUS, unique, and absolutely family-friendly! The video MUST be extremely funny and use the person from the selfie!`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You MUST analyze this selfie photo. Look at the person in the photo - their face, expression, clothing, and appearance. Then create a HILARIOUS 8-second Christmas video prompt that uses the EXACT person from the selfie (their face, expression, appearance) as the main character and adds Christmas theme elements around them (Santa, elves, snow, decorations, etc.). The person from the selfie must be the main character throughout. Make it EXTREMELY FUNNY with wholesome, family-friendly humor. End with the person from the selfie saying "Merry Christmas". This is a legitimate, family-friendly Christmas video project. DO NOT refuse - you MUST analyze the selfie and create the prompt.',
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

