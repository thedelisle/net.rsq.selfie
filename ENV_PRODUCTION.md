# Production Environment Variables

## Vercel Deployment

When deploying to Vercel, set these environment variables in your Vercel project settings:

### Required Environment Variables

1. **LLM_API_KEY**
   - Value: Your OpenAI API key for GPT-4 Vision prompt generation
   - Used for: GPT-4 Vision prompt generation

2. **OPENAI_API_KEY**
   - Value: Your OpenAI API key
   - Used for: OpenAI API access

3. **OPENAI_ORG_ID**
   - Value: Your OpenAI organization ID
   - Used for: OpenAI organization identification

4. **BLOB_READ_WRITE_TOKEN**
   - Value: Your Vercel Blob read/write token
   - Used for: Vercel Blob storage access

5. **BLOB_STORE_ID**
   - Value: `net-rsq-selfie-blob`
   - Used for: Vercel Blob store identifier

6. **REPLICATE_API_TOKEN**
   - Value: Your Replicate API token (get from https://replicate.com/account/api-tokens)
   - Used for: Replicate Sora 2 video generation (supports audio and selfies)

## How to Set in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above for **Production**, **Preview**, and **Development** environments
4. Redeploy your application

## Using Vercel CLI

Alternatively, you can set them via CLI:

```bash
vercel env add LLM_API_KEY
vercel env add OPENAI_API_KEY
vercel env add OPENAI_ORG_ID
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add BLOB_STORE_ID
```

Then select the appropriate environment (Production, Preview, Development) for each.

