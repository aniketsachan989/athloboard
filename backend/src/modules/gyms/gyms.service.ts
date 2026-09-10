import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class GymsService {
  constructor(private readonly db: DatabaseService) {}

  async listGyms(city?: string, isFeatured?: boolean) {
    let query = `SELECT * FROM gyms WHERE verification_status = 'verified'`;
    const params: any[] = [];
    if (city) {
      params.push(city);
      query += ` AND city ILIKE $${params.length}`;
    }
    if (isFeatured !== undefined) {
      params.push(isFeatured);
      query += ` AND is_featured = $${params.length}`;
    }
    query += ` ORDER BY avg_rating DESC, created_at DESC`;
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async getGymById(id: string) {
    const gymRes = await this.db.query(`SELECT * FROM gyms WHERE id = $1`, [id]);
    if (!gymRes.rows[0]) throw new NotFoundException('Gym not found');
    const plansRes = await this.db.query(`SELECT * FROM membership_plans WHERE gym_id = $1 AND is_active = true`, [id]);
    const reviewsRes = await this.db.query(`SELECT * FROM gym_reviews WHERE gym_id = $1 ORDER BY created_at DESC`, [id]);
    const promosRes = await this.db.query(`SELECT * FROM promotions WHERE gym_id = $1 AND is_active = true`, [id]);
    return {
      ...gymRes.rows[0],
      plans: plansRes.rows,
      reviews: reviewsRes.rows,
      promotions: promosRes.rows,
    };
  }

  async registerGym(owner: AuthenticatedUser, data: any) {
    const res = await this.db.query(
      `INSERT INTO gyms (
        owner_user_id, name, description, address, city, state, landmark,
        latitude, longitude, gym_type, amenities, equipment_tags, operating_hours,
        operational_days, pricing_period, total_plate_weight_kg, total_dumbbell_weight_kg,
        trainer_count_male, trainer_count_female, cover_photo_url, gallery_urls,
        verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 'pending')
      RETURNING *`,
      [
        owner.id, data.name, data.description || '', data.address || '', data.city || '', data.state || '', data.landmark || '',
        data.latitude || null, data.longitude || null, data.gym_type || 'unisex', JSON.stringify(data.amenities || []),
        JSON.stringify(data.equipment_tags || []), JSON.stringify(data.operating_hours || {}), data.operational_days || 'Mon-Sat',
        data.pricing_period || 'Monthly', data.total_plate_weight_kg || 0, data.total_dumbbell_weight_kg || 0,
        data.trainer_count_male || 0, data.trainer_count_female || 0, data.cover_photo_url || null,
        JSON.stringify(data.gallery_urls || []),
      ]
    );

    // Update owner user role to gym_owner
    await this.db.query(`UPDATE users SET role = 'gym_owner' WHERE id = $1`, [owner.id]);
    return res.rows[0];
  }

  async addReview(athlete: AuthenticatedUser, gymId: string, rating: number, comment: string) {
    const res = await this.db.query(
      `INSERT INTO gym_reviews (gym_id, athlete_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (gym_id, athlete_id) DO UPDATE SET rating = $3, comment = $4, created_at = now()
       RETURNING *`,
      [gymId, athlete.id, rating, comment]
    );
    // Recalculate gym average rating
    await this.db.query(
      `UPDATE gyms
       SET avg_rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM gym_reviews WHERE gym_id = $1),
           review_count = (SELECT COUNT(*) FROM gym_reviews WHERE gym_id = $1)
       WHERE id = $1`,
      [gymId]
    );
    return res.rows[0];
  }

  async createLead(athlete: AuthenticatedUser, gymId: string, message: string) {
    const res = await this.db.query(
      `INSERT INTO leads (gym_id, athlete_id, message) VALUES ($1, $2, $3) RETURNING *`,
      [gymId, athlete.id, message]
    );
    return res.rows[0];
  }
}
