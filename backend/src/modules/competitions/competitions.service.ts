import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class CompetitionsService {
  constructor(private readonly db: DatabaseService) {}

  async listCompetitions(city?: string) {
    let query = `SELECT c.*, g.name as gym_name,
                        (SELECT COUNT(*) FROM competition_registrations cr WHERE cr.competition_id = c.id) as registered_count
                 FROM competitions c
                 LEFT JOIN gyms g ON c.organizer_gym_id = g.id
                 WHERE c.status != 'draft'`;
    const params: any[] = [];
    if (city) {
      params.push(city);
      query += ` AND c.city ILIKE $${params.length}`;
    }
    query += ` ORDER BY c.event_date ASC`;
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async getCompetitionById(id: string) {
    const compRes = await this.db.query(
      `SELECT c.*, g.name as gym_name
       FROM competitions c
       LEFT JOIN gyms g ON c.organizer_gym_id = g.id
       WHERE c.id = $1`,
      [id]
    );
    if (!compRes.rows[0]) throw new NotFoundException('Competition not found');
    const resultsRes = await this.db.query(
      `SELECT cr.*, u.display_name, u.profile_photo_url
       FROM competition_results cr
       JOIN users u ON cr.athlete_id = u.id
       WHERE cr.competition_id = $1
       ORDER BY cr.rank ASC`,
      [id]
    );
    return { ...compRes.rows[0], results: resultsRes.rows };
  }

  async registerAthlete(athlete: AuthenticatedUser, compId: string, category: string) {
    const res = await this.db.query(
      `INSERT INTO competition_registrations (competition_id, athlete_id, category, payment_status)
       VALUES ($1, $2, $3, 'completed')
       ON CONFLICT (competition_id, athlete_id) DO NOTHING
       RETURNING *`,
      [compId, athlete.id, category || 'Open']
    );
    return res.rows[0] || { message: 'Already registered' };
  }
}
