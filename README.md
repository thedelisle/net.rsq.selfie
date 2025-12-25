# 🎄 Christmas Selfie Video Generator

Turn your selfie into a hilarious 30-second Christmas video using AI! This mobile-first app uses OpenAI's Sora video generation API to create unique, funny Christmas-themed videos from your selfie photos.

## Features

- 📸 **Mobile-Optimized Camera**: Take selfies directly from your phone
- 🎅 **AI-Powered Prompts**: GPT-4 Vision analyzes your selfie and generates hilarious, unique Christmas scenarios
- 🎬 **30-Second Videos**: OpenAI Sora generates high-quality Christmas videos
- ☁️ **Vercel Blob Storage**: Videos stored publicly for easy sharing
- 🔗 **Shareable Links**: Beautiful dedicated pages for each video
- 🎨 **Award-Winning UI**: Beautiful, festive design optimized for mobile

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API access with Sora enabled
- Vercel account with Blob storage

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd net.rsq.selfie
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
LLM_API_KEY="your-llm-api-key"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_ORG_ID="your-org-id"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
BLOB_STORE_ID="net-rsq-selfie-blob"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app will automatically:
- Use Vercel Blob storage for video storage
- Handle serverless API routes
- Optimize for mobile devices

## How It Works

1. **Capture Selfie**: User takes or uploads a selfie photo
2. **Analyze Photo**: GPT-4 Vision analyzes the selfie and generates a unique, hilarious Christmas prompt
3. **Generate Video**: OpenAI Sora API creates a 30-second video based on the prompt and selfie
4. **Store Video**: Video is uploaded to Vercel Blob storage for public access
5. **Share**: User gets a shareable link to a beautiful video page

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI API** (GPT-4 Vision + Sora)
- **Vercel Blob** (Storage)

## Project Structure

```
/app
  /api
    /upload-selfie/route.ts    # Handle selfie upload & video generation
    /video/[id]/route.ts       # Serve video metadata
  /page.tsx                    # Main selfie capture page
  /video/[id]/page.tsx         # Shareable video page
  /components                  # React components
  /lib                         # Utility functions
```

## Notes

- Video generation can take 30-60 seconds
- The app uses in-memory storage for video metadata (consider using a database for production)
- Make sure you have OpenAI API access with Sora video generation enabled

## License

ISC
