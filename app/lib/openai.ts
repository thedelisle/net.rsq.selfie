import OpenAI from 'openai';

// Helper to clean API keys (remove whitespace, newlines, etc.)
function cleanApiKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.trim().replace(/\s+/g, '');
}

// Validate and clean API keys
const openaiApiKey = cleanApiKey(process.env.OPENAI_API_KEY);
const llmApiKey = cleanApiKey(process.env.LLM_API_KEY) || openaiApiKey;
const orgId = process.env.OPENAI_ORG_ID?.trim();

if (!openaiApiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set');
}

if (!llmApiKey) {
  console.warn('Warning: LLM_API_KEY and OPENAI_API_KEY are not set');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
  organization: orgId,
});

export const openaiForPrompt = new OpenAI({
  apiKey: llmApiKey,
  organization: orgId,
});

