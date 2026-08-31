/**
 * Cloudflare R2 Direct Media Uploader for Athloboard Web Platform
 * Handles client-side direct PUT uploads to Cloudflare R2 via Backend Pre-Signed URLs.
 */

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
  bucket: string;
}

const BACKEND_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api/media';
const R2_PUBLIC_BASE = 'https://media.athloboard.com';

/**
 * Upload an arbitrary file directly to Cloudflare R2
 */
export async function uploadToCloudflareR2(
  file: File,
  folder: string,
  fileName: string,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  // 1. Request pre-signed PUT URL from backend
  const presignRes = await fetch(`${BACKEND_API_BASE}/presigned-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      folder,
      fileName,
      contentType: file.type || 'application/octet-stream',
      expiresInSeconds: 900,
    }),
  });

  if (!presignRes.ok) {
    throw new Error(`Failed to generate upload URL: ${presignRes.statusText}`);
  }

  const data: PresignedUrlResponse = await presignRes.json();

  // 2. Upload file directly to Cloudflare R2 using pre-signed URL
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', data.uploadUrl, true);
    if (file.type) {
      xhr.setRequestHeader('Content-Type', file.type);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        resolve(data.publicUrl);
      } else {
        reject(new Error(`R2 upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during R2 direct upload'));
    xhr.send(file);
  });
}

/**
 * Convenience method for Gym Facility photos
 */
export async function uploadGymPhotoToR2(
  gymId: string,
  photoId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadToCloudflareR2(file, `gym-photos/${gymId}`, `${photoId}.${ext}`);
}

/**
 * Convenience method for Marketplace Product photos
 */
export async function uploadProductPhotoToR2(
  productId: string,
  photoNumber: string | number,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadToCloudflareR2(file, `product-photos/${productId}`, `${photoNumber}.${ext}`);
}

/**
 * Convenience method for Business KYC Verification documents
 */
export async function uploadKycDocumentToR2(
  businessId: string,
  docType: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'pdf';
  return uploadToCloudflareR2(file, `kyc-documents/${businessId}`, `${docType}.${ext}`);
}
