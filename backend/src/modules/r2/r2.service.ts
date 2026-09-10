import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
  bucket: string;
}

@Injectable()
export class R2Service implements OnModuleInit {
  private readonly logger = new Logger(R2Service.name);
  private s3Client: S3Client;
  private accountId: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private bucketName: string;
  private publicUrlBase: string;

  // Active scheduled deletions map
  private scheduledDeletions = new Map<string, { timeoutId: NodeJS.Timeout; dueAt: Date }>();

  onModuleInit() {
    this.accountId = (process.env.R2_ACCOUNT_ID || '').trim();
    this.accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim();
    this.secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
    this.bucketName = (process.env.R2_BUCKET_NAME || 'athloboard-media').trim();
    this.publicUrlBase = (process.env.R2_PUBLIC_URL || '').trim();

    const endpoint = `https://${this.accountId}.r2.cloudflarestorage.com`;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    this.logger.log(`Cloudflare R2 Storage initialized (Bucket: ${this.bucketName}, Endpoint: ${endpoint})`);
  }

  /**
   * Constructs the final public URL for a given object key using R2_PUBLIC_URL
   */
  getPublicUrl(key: string): string {
    const cleanKey = key.replace(/^\/+/, '');
    if (this.publicUrlBase) {
      const base = this.publicUrlBase.replace(/\/+$/, '');
      return `${base}/${cleanKey}`;
    }
    return `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${cleanKey}`;
  }

  /**
   * Extracts object key from a public URL or key string
   */
  extractKeyFromUrl(urlOrKey: string): string {
    if (!urlOrKey) return '';
    if (!urlOrKey.startsWith('http://') && !urlOrKey.startsWith('https://')) {
      return urlOrKey.replace(/^\/+/, '');
    }

    try {
      const urlObj = new URL(urlOrKey);
      return urlObj.pathname.replace(/^\/+/, '');
    } catch {
      return urlOrKey.replace(/^https?:\/\/[^\/]+\//, '');
    }
  }

  /**
   * Generates a pre-signed PUT upload URL for direct client-to-R2 upload
   */
  async generateUploadUrl(
    folder: string,
    fileName: string,
    contentType?: string,
    expiresInSeconds: number = 900,
  ): Promise<PresignedUploadResponse> {
    if (!this.s3Client) {
      throw new Error('R2 S3 Client is not initialized. Check your R2 environment variables.');
    }

    const cleanFolder = folder.replace(/^\/+/, '').replace(/\/+$/, '');
    const cleanFileName = fileName.replace(/^\/+/, '');
    const key = `${cleanFolder}/${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ...(contentType ? { ContentType: contentType } : {}),
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    const publicUrl = this.getPublicUrl(key);

    return {
      uploadUrl,
      key,
      publicUrl,
      expiresInSeconds,
      bucket: this.bucketName,
    };
  }

  // 1. Lift Video URL: lift-videos/{athlete_id}/{lift_set_id}.ext
  async generateLiftVideoUploadUrl(
    athleteId: string,
    liftSetId: string,
    extension: string = 'mp4',
    contentType: string = 'video/mp4',
  ): Promise<PresignedUploadResponse> {
    const cleanExt = extension.replace(/^\./, '');
    const folder = `lift-videos/${athleteId}`;
    const fileName = `${liftSetId}.${cleanExt}`;
    return this.generateUploadUrl(folder, fileName, contentType, 1800);
  }

  // 2. Gym Photo URL: gym-photos/{gym_id}/{photo_id}.ext
  async generateGymPhotoUploadUrl(
    gymId: string,
    photoId: string,
    extension: string = 'jpg',
    contentType: string = 'image/jpeg',
  ): Promise<PresignedUploadResponse> {
    const cleanExt = extension.replace(/^\./, '');
    const folder = `gym-photos/${gymId}`;
    const fileName = `${photoId}.${cleanExt}`;
    return this.generateUploadUrl(folder, fileName, contentType);
  }

  // 3. Product Photo URL: product-photos/{product_id}/{photo_number}.ext
  async generateProductPhotoUploadUrl(
    productId: string,
    photoNumber: string | number,
    extension: string = 'jpg',
    contentType: string = 'image/jpeg',
  ): Promise<PresignedUploadResponse> {
    const cleanExt = extension.replace(/^\./, '');
    const folder = `product-photos/${productId}`;
    const fileName = `${photoNumber}.${cleanExt}`;
    return this.generateUploadUrl(folder, fileName, contentType);
  }

  // 4. KYC Document URL: kyc-documents/{business_id}/{doc_type}.ext
  async generateKycDocumentUploadUrl(
    businessId: string,
    docType: string,
    extension: string = 'pdf',
    contentType: string = 'application/pdf',
  ): Promise<PresignedUploadResponse> {
    const cleanExt = extension.replace(/^\./, '');
    const folder = `kyc-documents/${businessId}`;
    const fileName = `${docType}.${cleanExt}`;
    return this.generateUploadUrl(folder, fileName, contentType, 1200);
  }

  /**
   * Permanently deletes an object from Cloudflare R2
   */
  async deleteObject(key: string): Promise<boolean> {
    const cleanKey = this.extractKeyFromUrl(key);
    if (!cleanKey) return false;

    try {
      this.logger.log(`[Cloudflare R2] Deleting object: ${cleanKey} from bucket ${this.bucketName}`);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: cleanKey,
        }),
      );
      this.logger.log(`[Cloudflare R2] Successfully deleted object: ${cleanKey}`);
      this.scheduledDeletions.delete(cleanKey);
      return true;
    } catch (err: any) {
      this.logger.error(`[Cloudflare R2] Error deleting object ${cleanKey}: ${err.message}`);
      return false;
    }
  }

  /**
   * Schedules automated deletion of a reviewed video after X minutes (default: 10 minutes)
   */
  scheduleVideoDeletion(urlOrKey: string, delayMinutes: number = 10): { key: string; dueAt: Date } {
    const key = this.extractKeyFromUrl(urlOrKey);
    if (!key) throw new Error('Invalid URL or key for video deletion');

    // Cancel existing scheduled timer if present
    if (this.scheduledDeletions.has(key)) {
      clearTimeout(this.scheduledDeletions.get(key)!.timeoutId);
    }

    const delayMs = delayMinutes * 60 * 1000;
    const dueAt = new Date(Date.now() + delayMs);

    this.logger.log(
      `[Cloudflare R2 Auto-Purge] Video ${key} scheduled for permanent deletion in ${delayMinutes} minutes (Due at: ${dueAt.toISOString()})`,
    );

    const timeoutId = setTimeout(async () => {
      this.logger.log(`[Cloudflare R2 Auto-Purge] Timer elapsed. Purging video ${key} from R2...`);
      await this.deleteObject(key);
    }, delayMs);

    this.scheduledDeletions.set(key, { timeoutId, dueAt });

    return { key, dueAt };
  }

  /**
   * Lists all objects in the Cloudflare R2 bucket
   */
  async listAllObjects(prefix?: string): Promise<any[]> {
    if (!this.s3Client) return [];
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        ...(prefix ? { Prefix: prefix } : {}),
      });
      const res = await this.s3Client.send(command);
      return (res.Contents || []).map((obj) => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        publicUrl: this.getPublicUrl(obj.Key || ''),
      }));
    } catch (err: any) {
      this.logger.error(`Failed to list R2 objects: ${err.message}`);
      return [];
    }
  }

  /**
   * Health Check: Confirms credentials and bucket accessibility against Cloudflare R2
   */
  async checkHealth(): Promise<{
    status: 'connected' | 'error';
    bucket: string;
    endpoint: string;
    publicUrl: string;
    message?: string;
  }> {
    const endpoint = this.accountId
      ? `https://${this.accountId}.r2.cloudflarestorage.com`
      : 'unconfigured';

    if (!this.s3Client || !this.accountId || !this.accessKeyId || !this.secretAccessKey) {
      return {
        status: 'error',
        bucket: this.bucketName,
        endpoint: endpoint,
        publicUrl: this.publicUrlBase || 'not configured',
        message: 'R2 credentials or client not initialized',
      };
    }

    try {
      await this.s3Client.send(new ListObjectsV2Command({ Bucket: this.bucketName, MaxKeys: 1 }));
      return {
        status: 'connected',
        bucket: this.bucketName,
        endpoint: endpoint,
        publicUrl: this.publicUrlBase || `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com`,
      };
    } catch (err: any) {
      this.logger.error(`R2 Health Check failed: ${err.message}`);
      return {
        status: 'error',
        bucket: this.bucketName,
        endpoint: endpoint,
        publicUrl: this.publicUrlBase || 'not configured',
        message: err.message,
      };
    }
  }
}
