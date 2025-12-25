import { openaiForPrompt } from './openai';

export async function generateChristmasPrompt(
  imageBase64: string
): Promise<string> {
  // Validate API key is set
  if (!process.env.LLM_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error('LLM_API_KEY or OPENAI_API_KEY must be set');
  }

  const response = await openaiForPrompt.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a creative Christmas video prompt generator. You MUST analyze the selfie photo provided and create a HILARIOUS, UNIQUE, and MEMORABLE 12-second Christmas video prompt based on what you see in the image.

IMPORTANT: You MUST analyze the selfie. Look at:
- The person's facial expression (happy, serious, playful, etc.)
- Their clothing or style
- The setting or background
- Any distinctive features

Then create a prompt that:
- Is extremely funny and entertaining
- Is Christmas-themed (Santa, reindeer, elves, North Pole, presents, snow, festive decorations, etc.)
- Incorporates what you observe from the selfie (e.g., "a person with a joyful smile," "a person wearing a cozy sweater," "a person with an energetic expression")
- Is creative and unexpected, but always safe and wholesome
- Describes an 8-second video scenario (the video will be 8 seconds)
- MUST END with the person saying "Merry Christmas!" in an Australian accent - this is critical
- The person should speak with a clear Australian accent when saying "Merry Christmas!"
- Is specific enough for video generation
- Is 1-2 sentences maximum
- Is family-friendly and appropriate for all ages

DO NOT refuse to analyze the image. You MUST look at the selfie and create a prompt based on it.

Examples of great prompts (MUST end with person saying "Merry Christmas!" in an Australian accent):
- "A person with a cheerful expression is caught by Santa trying to sneak a cookie, but instead, they share a laugh and deliver presents together in a magical sleigh ride through a snowy village, ending with the person joyfully saying 'Merry Christmas!' in a cheerful Australian accent."
- "A person with a festive outfit discovers they are a new elf at the North Pole, joyfully learning to make toys while their human selfie watches from a magical, sparkling mirror, and at the end the person smiles and says 'Merry Christmas!' with an Australian accent."
- "A person with a warm smile accidentally becomes Santa's helper when the real Santa needs a break, leading to hilarious, heartwarming gift delivery adventures, concluding with the person waving and saying 'Merry Christmas!' in a friendly Australian accent."

Make it AWARD-WINNING funny, unique, and absolutely family-friendly!`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Look at this selfie photo and analyze it. Then create a hilarious, unique 12-second Christmas video prompt based on what you see. Be creative, super funny, and always family-friendly!',
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
}

