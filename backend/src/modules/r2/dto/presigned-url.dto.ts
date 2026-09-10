import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeneratePresignedUrlDto {
  @ApiProperty({ description: 'Target folder in R2 (e.g. lift-videos/ath_123, gym-photos/gym_456)', example: 'lift-videos/ath_123' })
  @IsString()
  @IsNotEmpty()
  folder: string;

  @ApiProperty({ description: 'Target file name with extension (e.g. set_1_raw_squat.mp4)', example: 'set_1_raw_squat.mp4' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({ description: 'MIME Content Type (e.g. video/mp4, image/jpeg, application/pdf)', example: 'video/mp4' })
  @IsString()
  @IsOptional()
  contentType?: string;

  @ApiPropertyOptional({ description: 'URL expiration time in seconds (default 900s = 15m)', example: 900, default: 900 })
  @IsNumber()
  @IsOptional()
  @Min(60)
  @Max(86400)
  expiresInSeconds?: number;
}

export class GenerateLiftVideoUrlDto {
  @ApiProperty({ description: 'Athlete Unique Identifier', example: 'ath_991823' })
  @IsString()
  @IsNotEmpty()
  athleteId: string;

  @ApiProperty({ description: 'Lift Set or Attempt ID', example: 'lift_sq_set_1' })
  @IsString()
  @IsNotEmpty()
  liftSetId: string;

  @ApiPropertyOptional({ description: 'File extension (e.g. mp4, mov)', default: 'mp4' })
  @IsString()
  @IsOptional()
  extension?: string;

  @ApiPropertyOptional({ description: 'MIME Type', default: 'video/mp4' })
  @IsString()
  @IsOptional()
  contentType?: string;
}

export class GenerateGymPhotoUrlDto {
  @ApiProperty({ description: 'Gym Partner ID', example: 'gym_iron_pulse_01' })
  @IsString()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Photo Identifier (e.g. combo_rack_1, calibrated_plates)', example: 'combo_rack_1' })
  @IsString()
  @IsNotEmpty()
  photoId: string;

  @ApiPropertyOptional({ description: 'File extension (e.g. jpg, png, webp)', default: 'jpg' })
  @IsString()
  @IsOptional()
  extension?: string;

  @ApiPropertyOptional({ description: 'MIME Type', default: 'image/jpeg' })
  @IsString()
  @IsOptional()
  contentType?: string;
}

export class GenerateProductPhotoUrlDto {
  @ApiProperty({ description: 'Product ID', example: 'prod_whey_isolate_2kg' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Photo Number or Identifier (e.g. 1, 2, label, hplc_report)', example: '1' })
  @IsString()
  @IsNotEmpty()
  photoNumber: string;

  @ApiPropertyOptional({ description: 'File extension (e.g. jpg, png, webp)', default: 'jpg' })
  @IsString()
  @IsOptional()
  extension?: string;

  @ApiPropertyOptional({ description: 'MIME Type', default: 'image/jpeg' })
  @IsString()
  @IsOptional()
  contentType?: string;
}

export class GenerateKycDocumentUrlDto {
  @ApiProperty({ description: 'Business ID (Gym or Brand Vendor ID)', example: 'biz_iron_pulse_ltd' })
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty({ description: 'Document Type (e.g. gst_certificate, fssai_license, pan_card, ipf_affiliation)', example: 'gst_certificate' })
  @IsString()
  @IsNotEmpty()
  docType: string;

  @ApiPropertyOptional({ description: 'File extension (e.g. pdf, jpg, png)', default: 'pdf' })
  @IsString()
  @IsOptional()
  extension?: string;

  @ApiPropertyOptional({ description: 'MIME Type', default: 'application/pdf' })
  @IsString()
  @IsOptional()
  contentType?: string;
}
