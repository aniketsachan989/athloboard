import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getProfile(user: AuthenticatedUser) {
    const userRes = await this.db.query('SELECT * FROM users WHERE id = $1', [user.id]);
    const athleteRes = await this.db.query('SELECT * FROM athlete_profiles WHERE user_id = $1', [user.id]);
    return {
      user: userRes.rows[0] || user,
      athleteProfile: athleteRes.rows[0] || null,
    };
  }

  async updateProfile(user: AuthenticatedUser, updateDto: any) {
    const {
      display_name,
      city,
      state,
      date_of_birth,
      gender,
      bio,
      instagram_handle,
      weight_class_kg,
      primary_gym_id,
      gym_experience_duration,
      preferred_gym_name,
      preferred_area,
    } = updateDto;

    // Update users table
    await this.db.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           city = COALESCE($2, city),
           state = COALESCE($3, state),
           date_of_birth = COALESCE($4, date_of_birth),
           gender = COALESCE($5, gender),
           bio = COALESCE($6, bio),
           instagram_handle = COALESCE($7, instagram_handle),
           updated_at = now()
       WHERE id = $8`,
      [display_name, city, state, date_of_birth, gender, bio, instagram_handle, user.id]
    );

    // Calculate completion percentage based on filled fields
    const filledCount = [
      display_name, city, state, date_of_birth, gender, bio, instagram_handle,
      weight_class_kg, primary_gym_id || preferred_gym_name, gym_experience_duration
    ].filter(Boolean).length;
    const completionPct = Math.min(100, Math.round((filledCount / 10) * 100));

    // Update athlete_profiles table
    await this.db.query(
      `UPDATE athlete_profiles
       SET weight_class_kg = COALESCE($1, weight_class_kg),
           primary_gym_id = COALESCE($2, primary_gym_id),
           gym_experience_duration = COALESCE($3, gym_experience_duration),
           preferred_gym_name = COALESCE($4, preferred_gym_name),
           preferred_area = COALESCE($5, preferred_area),
           profile_completion_pct = $6
       WHERE user_id = $7`,
      [weight_class_kg, primary_gym_id, gym_experience_duration, preferred_gym_name, preferred_area, completionPct, user.id]
    );

    return this.getProfile(user);
  }
}
