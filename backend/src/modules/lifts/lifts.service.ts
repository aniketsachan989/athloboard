import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class LiftsService {
  private readonly logger = new Logger(LiftsService.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly db: DatabaseService) {}

  async awardLiftPoints(athleteId: string, points: number, sourceId?: string, sourceType: string = 'pr_upload') {
    try {
      const description = `+${points} Points for Verified Lift (${sourceType})`;
      
      const ledgerRes = await this.db.query(
        `INSERT INTO lift_points_ledger (athlete_id, points, source_type, source_id, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [athleteId, points, sourceType, sourceId || null, description]
      );
      
      await this.db.query(
        `UPDATE athlete_profiles SET total_lift_points = total_lift_points + $1 WHERE user_id = $2`,
        [points, athleteId]
      );

      this.logger.log(`⭐ [Points Ledger] Awarded +${points} points to ${athleteId}`);
      return ledgerRes.rows[0];
    } catch (e: any) {
      this.logger.error(`Failed to award lift points: ${e.message}`);
      throw e;
    }
  }

  async processAiVerification(setId: string, exerciseName: string, claimedWeight: number, videoUrl: string, athleteId: string) {
    this.logger.log(`🤖 [AI Vision Worker] Triggering AI verification for ${setId} (${exerciseName} @ ${videoUrl})...`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${this.aiServiceUrl}/verify-lift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: videoUrl,
          exercise: exerciseName,
          claimed_weight_kg: claimedWeight,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AI Service returned HTTP ${response.status}`);
      }

      const aiData = await response.json();
      this.logger.log(`🤖 [AI Vision Worker] Microservice Result for ${setId}: ${JSON.stringify(aiData)}`);

      const confidence = Number(aiData.confidence) || 0;
      const formStatus = (aiData.form_status || '').toLowerCase();
      
      let newStatus = 'pending';
      let rejectionReason = null;
      let verifiedAt = null;

      if (confidence >= 0.75 && formStatus === 'pass') {
        newStatus = 'verified';
        verifiedAt = new Date().toISOString();
        this.logger.log(`✔ [AI Vision Pass] Submission ${setId} automatically VERIFIED by AI (Confidence: ${confidence}).`);
        await this.awardLiftPoints(athleteId, 100, setId, 'pr_upload');
      } else {
        rejectionReason = formStatus !== 'pass' ? `AI Flag: Form status ${formStatus}` : `Low AI Confidence (${(confidence * 100).toFixed(0)}%) - Queued for 3-Judge Audit`;
        this.logger.warn(`⚠ [AI Referee Flag] Submission ${setId} requires manual referee review (${rejectionReason}).`);
      }

      await this.db.query(
        `UPDATE lift_sets 
         SET ai_confidence = $1, status = $2, rejection_reason = $3, verified_at = $4 
         WHERE id = $5`,
        [confidence, newStatus, rejectionReason, verifiedAt, setId]
      );

    } catch (err: any) {
      this.logger.error(`❌ [AI Vision Error] AI Service call failed for ${setId}: ${err.message}`);
      await this.db.query(
        `UPDATE lift_sets 
         SET ai_confidence = 0.0, status = 'pending', rejection_reason = $1 
         WHERE id = $2`,
        [`AI Service Offline/Timeout (${err.message}) - Queued for Referee Studio`, setId]
      );
    }
  }

  async submitLiftVideo(data: {
    athleteId: string;
    athleteName?: string;
    exercise: string;
    weightKg: number;
    reps?: number;
    videoUrl: string;
  }) {
    // 1. Get or create exercise ID
    let exRes = await this.db.query(`SELECT id FROM exercises WHERE name ILIKE $1`, [data.exercise]);
    let exerciseId = exRes.rows[0]?.id;
    if (!exerciseId) {
       const newEx = await this.db.query(
         `INSERT INTO exercises (name, category) VALUES ($1, 'strength') RETURNING id`, 
         [data.exercise]
       );
       exerciseId = newEx.rows[0].id;
    }

    // 2. Create lift session
    const sessionRes = await this.db.query(
      `INSERT INTO lift_sessions (athlete_id, exercise_id) VALUES ($1, $2) RETURNING id`,
      [data.athleteId, exerciseId]
    );
    const sessionId = sessionRes.rows[0].id;

    // 3. Create lift set
    const setRes = await this.db.query(
      `INSERT INTO lift_sets (session_id, set_number, reps, weight_kg, video_url, is_verification_target, status)
       VALUES ($1, 1, $2, $3, $4, true, 'pending') RETURNING *`,
      [sessionId, data.reps || 1, data.weightKg, data.videoUrl]
    );
    const setId = setRes.rows[0].id;

    this.logger.log(`✅ [Database] Stored new lift submission ${setId} (Status: PENDING). Triggering AI Pipeline...`);

    // Trigger AI verification in background
    setTimeout(() => {
      this.processAiVerification(setId, data.exercise, data.weightKg, data.videoUrl, data.athleteId).catch((e) => this.logger.error(`Async AI error: ${e.message}`));
    }, 100);

    return setRes.rows[0];
  }

  async getPendingLifts() {
    const res = await this.db.query(
      `SELECT ls.*, e.name as exercise_name, u.display_name as athlete_name, u.id as athlete_id
       FROM lift_sets ls
       JOIN lift_sessions s ON ls.session_id = s.id
       JOIN exercises e ON s.exercise_id = e.id
       JOIN users u ON s.athlete_id = u.id
       WHERE ls.is_verification_target = true AND ls.status = 'pending'
       ORDER BY ls.created_at ASC`
    );
    return res.rows;
  }

  async getAllLifts() {
    const res = await this.db.query(
      `SELECT ls.*, e.name as exercise_name, u.display_name as athlete_name, u.id as athlete_id
       FROM lift_sets ls
       JOIN lift_sessions s ON ls.session_id = s.id
       JOIN exercises e ON s.exercise_id = e.id
       JOIN users u ON s.athlete_id = u.id
       ORDER BY ls.created_at DESC`
    );
    return res.rows;
  }

  async getSubmissions(athleteId?: string) {
    if (athleteId) {
      const res = await this.db.query(
        `SELECT ls.*, e.name as exercise_name, u.display_name as athlete_name, u.id as athlete_id
         FROM lift_sets ls
         JOIN lift_sessions s ON ls.session_id = s.id
         JOIN exercises e ON s.exercise_id = e.id
         JOIN users u ON s.athlete_id = u.id
         WHERE u.id = $1
         ORDER BY ls.created_at DESC`,
        [athleteId]
      );
      return res.rows;
    }
    return this.getAllLifts();
  }

  async getSubmissionById(id: string) {
    const res = await this.db.query(
      `SELECT ls.*, e.name as exercise_name, u.display_name as athlete_name, u.id as athlete_id
       FROM lift_sets ls
       JOIN lift_sessions s ON ls.session_id = s.id
       JOIN exercises e ON s.exercise_id = e.id
       JOIN users u ON s.athlete_id = u.id
       WHERE ls.id = $1`,
      [id]
    );
    return res.rows[0];
  }

  async updateLiftStatus(id: string, status: 'verified' | 'rejected', notes?: string) {
    const liftRes = await this.db.query(`SELECT s.athlete_id, ls.status as prev_status FROM lift_sets ls JOIN lift_sessions s ON ls.session_id = s.id WHERE ls.id = $1`, [id]);
    const lift = liftRes.rows[0];
    if (!lift) return null;

    const res = await this.db.query(
      `UPDATE lift_sets 
       SET status = $1, rejection_reason = $2, verified_at = CASE WHEN $1 = 'verified' THEN NOW() ELSE NULL END
       WHERE id = $3 RETURNING *`,
      [status, notes || null, id]
    );

    if (status === 'verified' && lift.prev_status !== 'verified') {
      await this.awardLiftPoints(lift.athlete_id, 100, id, 'referee_override');
    }

    return res.rows[0];
  }

  async getPointsLedger(athleteId?: string) {
    if (athleteId) {
      const res = await this.db.query(`SELECT * FROM lift_points_ledger WHERE athlete_id = $1 ORDER BY created_at DESC`, [athleteId]);
      return res.rows;
    }
    const res = await this.db.query(`SELECT * FROM lift_points_ledger ORDER BY created_at DESC`);
    return res.rows;
  }

  async getAthletePointsBalance(athleteId: string) {
    const res = await this.db.query(`SELECT user_id as athlete_id, total_lift_points FROM athlete_profiles WHERE user_id = $1`, [athleteId]);
    return res.rows[0] || { athlete_id: athleteId, total_lift_points: 0 };
  }

  async getLeaderboard(exercise?: string, weightClass?: number, city?: string) {
    // Dynamic leaderboard calculated from verified submissions in DB
    const res = await this.db.query(
      `SELECT 
         u.id as athlete_id, 
         u.display_name, 
         COALESCE(u.city, 'National') as city,
         p.weight_class_kg,
         MAX(CASE WHEN e.name ILIKE '%squat%' THEN ls.weight_kg ELSE 0 END) as max_squat,
         MAX(CASE WHEN e.name ILIKE '%bench%' THEN ls.weight_kg ELSE 0 END) as max_bench,
         MAX(CASE WHEN e.name ILIKE '%deadlift%' THEN ls.weight_kg ELSE 0 END) as max_deadlift
       FROM users u
       JOIN athlete_profiles p ON u.id = p.user_id
       JOIN lift_sessions s ON u.id = s.athlete_id
       JOIN lift_sets ls ON s.id = ls.session_id
       JOIN exercises e ON s.exercise_id = e.id
       WHERE ls.status = 'verified'
       GROUP BY u.id, u.display_name, u.city, p.weight_class_kg`
    );

    const leaderboard = res.rows.map(a => {
      const sq = Number(a.max_squat);
      const be = Number(a.max_bench);
      const dl = Number(a.max_deadlift);
      return {
        ...a,
        max_squat: sq,
        max_bench: be,
        max_deadlift: dl,
        total_sbd: sq + be + dl
      };
    }).sort((a, b) => b.total_sbd - a.total_sbd).map((item, idx) => ({ rank: idx + 1, ...item }));

    return leaderboard;
  }
}
