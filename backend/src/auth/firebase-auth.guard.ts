import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../modules/firebase/firebase.service';
import { DatabaseService } from '../database/database.service';

/**
 * FIREBASE AUTH GUARD (STRICT CRYPTOGRAPHIC VERIFICATION)
 *
 * CRITICAL SECURITY RULE: Every request MUST carry a valid, cryptographically signed
 * Firebase ID token. No mock strings or client-supplied IDs are permitted.
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header. Expected: Bearer <Firebase_ID_Token>');
    }

    const token = authHeader.split('Bearer ')[1].trim();

    // STRICT FIREBASE ID TOKEN VERIFICATION - NO MOCKS OR BYPASSES
    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(token);
    } catch (error: any) {
      this.logger.error(`Firebase Token verification rejected: ${error.message}`);
      throw new UnauthorizedException(`Invalid or expired Firebase authentication token: ${error.message}`);
    }

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email || `${firebaseUid}@athloboard.com`;
    const displayName = decodedToken.name || 'Athlete';
    const photoUrl = decodedToken.picture || null;

    // Look up or auto-provision the verified user row with UPSERT
    const upsertRes = await this.db.query(
      `INSERT INTO users (firebase_uid, email, display_name, profile_photo_url, role)
       VALUES ($1, $2, $3, $4, 'athlete')
       ON CONFLICT (firebase_uid) DO UPDATE SET updated_at = now()
       RETURNING *`,
      [firebaseUid, email, displayName, photoUrl]
    );

    const user = upsertRes.rows[0];

    if (!user) {
      throw new UnauthorizedException('Failed to create or retrieve user profile');
    }

    if (user.is_active === false) {
      throw new UnauthorizedException('Account suspended');
    }

    // Ensure athlete profile exists
    await this.db.query(
      `INSERT INTO athlete_profiles (user_id, total_lift_points, current_streak_days, profile_completion_pct)
       VALUES ($1, 0, 0, 30)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    request.user = user;
    return true;
  }
}
