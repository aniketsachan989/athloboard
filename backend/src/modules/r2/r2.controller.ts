import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { R2Service, PresignedUploadResponse } from './r2.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import {
  GeneratePresignedUrlDto,
  GenerateLiftVideoUrlDto,
  GenerateGymPhotoUrlDto,
  GenerateProductPhotoUrlDto,
  GenerateKycDocumentUrlDto,
} from './dto/presigned-url.dto';

@ApiTags('Media & Cloudflare R2 Storage')
@UseGuards(FirebaseAuthGuard)
@Controller('api/media')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate custom pre-signed PUT upload URL for R2' })
  @ApiResponse({ status: 200, description: 'Pre-signed URL generated successfully' })
  async generatePresignedUrl(@Body() dto: GeneratePresignedUrlDto): Promise<PresignedUploadResponse> {
    return this.r2Service.generateUploadUrl(
      dto.folder,
      dto.fileName,
      dto.contentType,
      dto.expiresInSeconds || 900,
    );
  }

  @Post('lift-video-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate pre-signed upload URL for athlete lift video: lift-videos/{athlete_id}/{lift_set_id}.ext' })
  async generateLiftVideoUrl(@Body() dto: GenerateLiftVideoUrlDto): Promise<PresignedUploadResponse> {
    return this.r2Service.generateLiftVideoUploadUrl(
      dto.athleteId,
      dto.liftSetId,
      dto.extension || 'mp4',
      dto.contentType || 'video/mp4',
    );
  }

  @Post('gym-photo-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate pre-signed upload URL for gym audit photo: gym-photos/{gym_id}/{photo_id}.ext' })
  async generateGymPhotoUrl(@Body() dto: GenerateGymPhotoUrlDto): Promise<PresignedUploadResponse> {
    return this.r2Service.generateGymPhotoUploadUrl(
      dto.gymId,
      dto.photoId,
      dto.extension || 'jpg',
      dto.contentType || 'image/jpeg',
    );
  }

  @Post('product-photo-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate pre-signed upload URL for store product: product-photos/{product_id}/{photo_number}.ext' })
  async generateProductPhotoUrl(@Body() dto: GenerateProductPhotoUrlDto): Promise<PresignedUploadResponse> {
    return this.r2Service.generateProductPhotoUploadUrl(
      dto.productId,
      dto.photoNumber,
      dto.extension || 'jpg',
      dto.contentType || 'image/jpeg',
    );
  }

  @Post('kyc-document-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate pre-signed upload URL for KYC doc: kyc-documents/{business_id}/{doc_type}.ext' })
  async generateKycDocumentUrl(@Body() dto: GenerateKycDocumentUrlDto): Promise<PresignedUploadResponse> {
    return this.r2Service.generateKycDocumentUploadUrl(
      dto.businessId,
      dto.docType,
      dto.extension || 'pdf',
      dto.contentType || 'application/pdf',
    );
  }

  @Get('objects')
  @ApiOperation({ summary: 'List all objects stored in Cloudflare R2 bucket' })
  async listObjects(@Query('prefix') prefix?: string) {
    const objects = await this.r2Service.listAllObjects(prefix);
    return {
      bucket: process.env.R2_BUCKET_NAME || 'athloboard-media',
      count: objects.length,
      objects,
    };
  }

  @Get('public-url')
  @ApiOperation({ summary: 'Construct CDN public URL for a given object key in R2' })
  @ApiQuery({ name: 'key', description: 'Object Key in R2 (e.g. lift-videos/ath_123/set_1.mp4)', example: 'lift-videos/ath_123/set_1.mp4' })
  getPublicUrl(@Query('key') key: string): { key: string; publicUrl: string } {
    return {
      key,
      publicUrl: this.r2Service.getPublicUrl(key || ''),
    };
  }
}
