import { put, list, del } from '@vercel/blob';

export async function uploadToBlob(
  filename: string,
  file: Blob | Buffer,
  contentType?: string
): Promise<string> {
  const { url } = await put(filename, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

export async function listVideosFromBlob(): Promise<Array<{ url: string; uploadedAt: Date; pathname: string }>> {
  const { blobs } = await list({
    prefix: 'videos/',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  
  return blobs
    .filter(blob => blob.pathname.endsWith('.mp4'))
    .map(blob => ({
      url: blob.url,
      uploadedAt: blob.uploadedAt,
      pathname: blob.pathname,
    }))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()); // Sort by newest first
}

export async function deleteVideoFromBlob(pathname: string): Promise<void> {
  await del(pathname, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function listSelfiesFromBlob(): Promise<Array<{ url: string; uploadedAt: Date; pathname: string }>> {
  const { blobs } = await list({
    prefix: 'selfies/',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  
  return blobs
    .map(blob => ({
      url: blob.url,
      uploadedAt: blob.uploadedAt,
      pathname: blob.pathname,
    }))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()); // Sort by newest first
}

