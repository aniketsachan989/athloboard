import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { FirebaseService } from '../modules/firebase/firebase.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({ description: 'Genuine Firebase or Google Sign-In ID Token (JWT)', example: 'eyJhbGciOiJSUzI1NiIs...' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

@ApiTags('Authentication & Identity')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('verify-id-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cryptographically verify Firebase ID Token using Firebase Admin SDK' })
  @ApiResponse({ status: 200, description: 'Token verified successfully' })
  @ApiResponse({ status: 401, description: 'Token invalid, expired, or malformed' })
  async verifyIdToken(@Body() dto: VerifyTokenDto) {
    try {
      // STRICT CRYPTOGRAPHIC VERIFICATION DIRECTLY THROUGH FIREBASE ADMIN SDK
      const decoded = await this.firebaseService.verifyIdToken(dto.token);
      return {
        valid: true,
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || 'Verified Athlete',
        picture: decoded.picture || null,
        auth_time: decoded.auth_time,
        iss: decoded.iss,
        aud: decoded.aud,
      };
    } catch (err: any) {
      throw new UnauthorizedException(`Firebase ID Token verification failed: ${err.message}`);
    }
  }
}
