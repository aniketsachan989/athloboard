import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  private async logAction(admin: AuthenticatedUser, action: string, targetType: string, targetId: string, notes?: string) {
    await this.db.query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [admin.id, action, targetType, targetId, notes || null]
    );
  }

  async getPendingGyms() {
    const res = await this.db.query(`SELECT * FROM gyms WHERE verification_status IN ('unverified', 'pending') ORDER BY created_at ASC`);
    return res.rows;
  }

  async verifyGym(admin: AuthenticatedUser, id: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE gyms SET verification_status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
      [status, approve ? null : reason, id]
    );
    await this.logAction(admin, `GYM_${status.toUpperCase()}`, 'gym', id, reason);
    return res.rows[0];
  }

  async getPendingBrands() {
    const res = await this.db.query(`SELECT * FROM brands WHERE verification_status != 'verified' ORDER BY created_at ASC`);
    return res.rows;
  }

  async verifyBrand(admin: AuthenticatedUser, id: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE brands SET verification_status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
      [status, approve ? null : reason, id]
    );
    await this.logAction(admin, `BRAND_${status.toUpperCase()}`, 'brand', id, reason);
    return res.rows[0];
  }

  async getPendingVendors() {
    const res = await this.db.query(`SELECT * FROM vendors WHERE verification_status != 'verified' ORDER BY created_at ASC`);
    return res.rows;
  }

  async verifyVendor(admin: AuthenticatedUser, id: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE vendors SET verification_status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
      [status, approve ? null : reason, id]
    );
    await this.logAction(admin, `VENDOR_${status.toUpperCase()}`, 'vendor', id, reason);
    return res.rows[0];
  }

  async getPendingProducts() {
    const res = await this.db.query(
      `SELECT p.*, v.shop_name, b.brand_name
       FROM products p
       LEFT JOIN vendors v ON p.vendor_id = v.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.listing_status != 'verified' ORDER BY p.created_at ASC`
    );
    return res.rows;
  }

  async verifyProduct(admin: AuthenticatedUser, id: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    // DB trigger will handle 2-strike check if rejected
    const res = await this.db.query(
      `UPDATE products SET listing_status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
      [status, approve ? null : reason, id]
    );
    await this.logAction(admin, `PRODUCT_${status.toUpperCase()}`, 'product', id, reason);
    return res.rows[0];
  }

  async getPendingLifts() {
    const res = await this.db.query(
      `SELECT ls.*, e.name as exercise_name, u.display_name as athlete_name, u.id as athlete_id
       FROM lift_sets ls
       JOIN lift_sessions sess ON ls.session_id = sess.id
       JOIN exercises e ON sess.exercise_id = e.id
       JOIN users u ON sess.athlete_id = u.id
       WHERE ls.is_verification_target = true AND ls.status = 'pending'
       ORDER BY ls.created_at ASC`
    );
    return res.rows;
  }

  async refereeLift(admin: AuthenticatedUser, setId: string, approve: boolean, notes?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE lift_sets
       SET status = $1, rejection_reason = $2, verified_at = now()
       WHERE id = $3 RETURNING *`,
      [status, approve ? null : notes, setId]
    );

    const liftSet = res.rows[0];
    if (liftSet && approve) {
      // Award 50 Lift Points to the athlete
      const sessRes = await this.db.query('SELECT athlete_id FROM lift_sessions WHERE id = $1', [liftSet.session_id]);
      const athleteId = sessRes.rows[0]?.athlete_id;
      if (athleteId) {
        await this.db.query('UPDATE athlete_profiles SET total_lift_points = total_lift_points + 50 WHERE user_id = $1', [athleteId]);
        await this.db.query(
          `INSERT INTO lift_points_ledger (athlete_id, points, source_type, description)
           VALUES ($1, 50, 'verified_lift', 'Verified Lift PR Award')`,
          [athleteId]
        );
      }
    }

    await this.logAction(admin, `LIFT_${status.toUpperCase()}`, 'lift_set', setId, notes);
    return liftSet;
  }

  async getAnalytics() {
    const athletesCount = await this.db.query(`SELECT COUNT(*) FROM users WHERE role = 'athlete'`);
    const gymsCount = await this.db.query(`SELECT COUNT(*) FROM gyms WHERE verification_status = 'verified'`);
    const productsCount = await this.db.query(`SELECT COUNT(*) FROM products WHERE listing_status = 'verified'`);
    const verifiedLiftsCount = await this.db.query(`SELECT COUNT(*) FROM lift_sets WHERE status = 'verified'`);
    const gmvRes = await this.db.query(`SELECT COALESCE(SUM(price * stock_number), 0) as inventory_value FROM products WHERE listing_status = 'verified'`);

    return {
      athletes: parseInt(athletesCount.rows[0]?.count || '0', 10),
      verifiedGyms: parseInt(gymsCount.rows[0]?.count || '0', 10),
      verifiedProducts: parseInt(productsCount.rows[0]?.count || '0', 10),
      verifiedLifts: parseInt(verifiedLiftsCount.rows[0]?.count || '0', 10),
      inventoryValue: parseFloat(gmvRes.rows[0]?.inventory_value || '0'),
    };
  }

  async getAuditLogs() {
    const res = await this.db.query(
      `SELECT a.*, u.display_name as admin_name, u.email as admin_email
       FROM admin_audit_log a
       JOIN users u ON a.admin_id = u.id
       ORDER BY a.created_at DESC LIMIT 100`
    );
    return res.rows;
  }
}
