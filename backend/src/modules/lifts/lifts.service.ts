import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class LiftsService {
  constructor(private readonly db: DatabaseService) {}

  async createSession(athlete: AuthenticatedUser, exerciseName: string) {
    const exRes = await this.db.query('SELECT id FROM exercises WHERE name ILIKE $1', [exerciseName]);
    const exerciseId = exRes.rows[0]?.id || 1;

    const res = await this.db.query(
      `INSERT INTO lift_sessions (athlete_id, exercise_id) VALUES ($1, $2) RETURNING *`,
      [athlete.id, exerciseId]
    );
    return res.rows[0];
  }

  async logSet(athlete: AuthenticatedUser, sessionId: string, data: any) {
    const res = await this.db.query(
      `INSERT INTO lift_sets (
        session_id, set_number, reps, weight_kg, is_verification_target,
        video_url, effort_rating, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        sessionId, data.set_number, data.reps, data.weight_kg,
        data.is_verification_target || false, data.video_url || null,
        data.effort_rating || null, data.video_url ? 'pending' : 'verified'
      ]
    );
    return res.rows[0];
  }

  async getLeaderboard(exercise?: string, weightClass?: number, city?: string) {
    let query = `
      SELECT 
        u.id as athlete_id,
        u.display_name,
        u.profile_photo_url,
        u.city,
        ap.weight_class_kg,
        COALESCE(MAX(CASE WHEN e.name ILIKE '%Squat%' THEN ls.weight_kg END), 0) as max_squat,
        COALESCE(MAX(CASE WHEN e.name ILIKE '%Bench%' THEN ls.weight_kg END), 0) as max_bench,
        COALESCE(MAX(CASE WHEN e.name ILIKE '%Deadlift%' THEN ls.weight_kg END), 0) as max_deadlift,
        (
          COALESCE(MAX(CASE WHEN e.name ILIKE '%Squat%' THEN ls.weight_kg END), 0) +
          COALESCE(MAX(CASE WHEN e.name ILIKE '%Bench%' THEN ls.weight_kg END), 0) +
          COALESCE(MAX(CASE WHEN e.name ILIKE '%Deadlift%' THEN ls.weight_kg END), 0)
        ) as total_sbd
      FROM users u
      JOIN athlete_profiles ap ON u.id = ap.user_id
      LEFT JOIN lift_sessions sess ON ap.user_id = sess.athlete_id
      LEFT JOIN exercises e ON sess.exercise_id = e.id
      LEFT JOIN lift_sets ls ON sess.id = ls.session_id AND ls.status = 'verified'
      WHERE u.role = 'athlete'
    `;
    const params: any[] = [];
    if (city) {
      params.push(city);
      query += ` AND u.city ILIKE $${params.length}`;
    }
    if (weightClass) {
      params.push(weightClass);
      query += ` AND ap.weight_class_kg = $${params.length}`;
    }
    query += `
      GROUP BY u.id, u.display_name, u.profile_photo_url, u.city, ap.weight_class_kg
      ORDER BY total_sbd DESC
      LIMIT 100
    `;
    const res = await this.db.query(query, params);
    return res.rows.map((row, idx) => ({ rank: idx + 1, ...row }));
  }
}
