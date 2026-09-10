import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class RewardsService {
  constructor(private readonly db: DatabaseService) {}

  async getCatalog() {
    const res = await this.db.query('SELECT * FROM rewards_catalog WHERE is_active = true ORDER BY points_cost ASC');
    return res.rows;
  }

  async getMyPoints(athlete: AuthenticatedUser) {
    const profile = await this.db.query('SELECT total_lift_points, current_streak_days FROM athlete_profiles WHERE user_id = $1', [athlete.id]);
    const ledger = await this.db.query('SELECT * FROM lift_points_ledger WHERE athlete_id = $1 ORDER BY created_at DESC LIMIT 50', [athlete.id]);
    const redemptions = await this.db.query(
      `SELECT rr.*, rc.name as reward_name, rc.reward_type
       FROM reward_redemptions rr
       JOIN rewards_catalog rc ON rr.reward_id = rc.id
       WHERE rr.athlete_id = $1 ORDER BY rr.redeemed_at DESC`,
      [athlete.id]
    );
    return {
      points: profile.rows[0]?.total_lift_points || 0,
      streakDays: profile.rows[0]?.current_streak_days || 0,
      history: ledger.rows,
      redemptions: redemptions.rows,
    };
  }

  async redeemReward(athlete: AuthenticatedUser, rewardId: string) {
    const rewardRes = await this.db.query('SELECT * FROM rewards_catalog WHERE id = $1 AND is_active = true', [rewardId]);
    const reward = rewardRes.rows[0];
    if (!reward) throw new BadRequestException('Reward not found or inactive');

    const profileRes = await this.db.query('SELECT total_lift_points FROM athlete_profiles WHERE user_id = $1', [athlete.id]);
    const currentPoints = profileRes.rows[0]?.total_lift_points || 0;

    if (currentPoints < reward.points_cost) {
      throw new BadRequestException(`Insufficient Lift Points. Required: ${reward.points_cost}, Current: ${currentPoints}`);
    }

    // Deduct points from profile
    await this.db.query(
      'UPDATE athlete_profiles SET total_lift_points = total_lift_points - $1 WHERE user_id = $2',
      [reward.points_cost, athlete.id]
    );

    // Create ledger entry
    const ledgerRes = await this.db.query(
      `INSERT INTO lift_points_ledger (athlete_id, points, source_type, description)
       VALUES ($1, $2, 'redemption', $3)
       RETURNING id`,
      [athlete.id, -reward.points_cost, `Redeemed: ${reward.name}`]
    );

    // Create redemption record
    const redemptionRes = await this.db.query(
      `INSERT INTO reward_redemptions (athlete_id, reward_id, ledger_entry_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [athlete.id, rewardId, ledgerRes.rows[0]?.id]
    );

    return redemptionRes.rows[0];
  }
}
