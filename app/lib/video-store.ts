// Simple in-memory store for video metadata (in production, use a database)
export const videoStore = new Map<string, { url: string; prompt: string; createdAt: Date }>();

// Store the single current video ID (only one video can exist at a time)
let currentVideoId: string | null = null;

// Function to reset the current video
export function resetCurrentVideo() {
  if (currentVideoId) {
    videoStore.delete(currentVideoId);
    currentVideoId = null;
  }
}

export function getCurrentVideoId() {
  return currentVideoId;
}

export function setCurrentVideoId(id: string) {
  currentVideoId = id;
}

