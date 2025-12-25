import { listSelfiesFromBlob } from '../app/lib/blob';
import { generateChristmasPrompt } from '../app/lib/prompt-generator';
import { uploadToBlob } from '../app/lib/blob';
import { randomBytes } from 'crypto';
import Replicate from 'replicate';
import { setCurrentVideoId } from '../app/lib/video-store';
import { videoStore } from '../app/lib/video-store';

async function generateVideoFromLatestSelfie() {
  try {
    console.log('Fetching latest selfie from blob storage...');
    const selfies = await listSelfiesFromBlob();
    
    if (selfies.length === 0) {
      console.error('No selfies found in blob storage');
      process.exit(1);
    }
    
    const latestSelfie = selfies[0];
    console.log('Latest selfie:', latestSelfie.url);
    console.log('Uploaded at:', latestSelfie.uploadedAt);
    
    // Download the selfie
    console.log('Downloading selfie...');
    const selfieResponse = await fetch(latestSelfie.url);
    if (!selfieResponse.ok) {
      throw new Error('Failed to download selfie');
    }
    
    const selfieBuffer = Buffer.from(await selfieResponse.arrayBuffer());
    const base64Image = selfieBuffer.toString('base64');
    
    // Generate prompt
    console.log('Generating Christmas prompt from selfie...');
    const prompt = await generateChristmasPrompt(base64Image);
    console.log('✅ Generated prompt:', prompt);
    
    // Check if video already exists
    const { getCurrentVideoId } = await import('../app/lib/video-store');
    if (getCurrentVideoId()) {
      console.log('⚠️  A video already exists. Please reset first.');
      process.exit(1);
    }
    
    // Generate video with Replicate
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set');
    }
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    
    console.log('Generating video with Replicate (Google Veo 3)...');
    const output = await replicate.run(
      "google/veo-3" as `${string}/${string}`,
      {
        input: {
          prompt: prompt,
          image: latestSelfie.url, // Use the blob URL
          duration: 8,
        }
      }
    );
    
    console.log('✅ Video generated!');
    
    // Handle output (URL or ReadableStream)
    let videoBuffer: Buffer;
    
    // Check if output is a ReadableStream (Node.js ReadableStream)
    const isReadableStream = output && typeof output === 'object' && 'getReader' in output;
    
    if (isReadableStream) {
      const chunks: Uint8Array[] = [];
      const reader = output.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      videoBuffer = Buffer.from(combined);
    } else {
      const videoUrl = Array.isArray(output) ? output[0] : output;
      
      if (!videoUrl || typeof videoUrl !== 'string') {
        throw new Error('No video URL returned from Replicate');
      }
      
      console.log('Downloading video from Replicate:', videoUrl);
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error('Failed to download video from Replicate');
      }
      
      videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    }
    
    // Upload video to blob
    const videoId = randomBytes(16).toString('hex');
    const videoBlobUrl = await uploadToBlob(
      `videos/${videoId}.mp4`,
      videoBuffer,
      'video/mp4'
    );
    
    console.log('✅ Video uploaded to blob:', videoBlobUrl);
    
    // Store video metadata
    videoStore.set(videoId, {
      url: videoBlobUrl,
      prompt: prompt,
      createdAt: new Date(),
    });
    
    setCurrentVideoId(videoId);
    
    console.log('✅ Video generation complete!');
    console.log('Video ID:', videoId);
    console.log('Video URL:', videoBlobUrl);
    
  } catch (error) {
    console.error('Error generating video:', error);
    process.exit(1);
  }
}

generateVideoFromLatestSelfie();

