import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { R2Service } from '../r2/r2.service';
import { LiftsService } from '../lifts/lifts.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly r2Service: R2Service,
    private readonly liftsService: LiftsService,
  ) {}

  async getPendingGyms() {
    const res = await this.db.query(
      `SELECT g.*, u.display_name as owner_name, u.email as owner_email
       FROM gyms g
       JOIN users u ON g.owner_user_id = u.id
       WHERE g.verification_status = 'pending'
       ORDER BY g.created_at ASC`
    );
    return res.rows;
  }

  async verifyGym(admin: AuthenticatedUser, gymId: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE gyms 
       SET verification_status = $1, rejection_reason = $2 
       WHERE id = $3 RETURNING *`,
      [status, reason || null, gymId]
    );

    await this.logAction(admin.id, `VERIFY_GYM_${status.toUpperCase()}`, gymId, reason);
    return res.rows[0];
  }

  async getPendingBrands() {
    const res = await this.db.query(
      `SELECT b.*, u.display_name as owner_name, u.email as owner_email
       FROM brands b
       JOIN users u ON b.owner_user_id = u.id
       WHERE b.verification_status = 'pending'
       ORDER BY b.created_at ASC`
    );
    return res.rows;
  }

  async verifyBrand(admin: AuthenticatedUser, brandId: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE brands 
       SET verification_status = $1, rejection_reason = $2 
       WHERE id = $3 RETURNING *`,
      [status, reason || null, brandId]
    );

    await this.logAction(admin.id, `VERIFY_BRAND_${status.toUpperCase()}`, brandId, reason);
    return res.rows[0];
  }

  async getPendingVendors() {
    const res = await this.db.query(
      `SELECT v.*, u.display_name as owner_name, u.email as owner_email
       FROM vendors v
       JOIN users u ON v.owner_user_id = u.id
       WHERE v.verification_status = 'pending'
       ORDER BY v.created_at ASC`
    );
    return res.rows;
  }

  async verifyVendor(admin: AuthenticatedUser, vendorId: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE vendors 
       SET verification_status = $1, rejection_reason = $2 
       WHERE id = $3 RETURNING *`,
      [status, reason || null, vendorId]
    );

    await this.logAction(admin.id, `VERIFY_VENDOR_${status.toUpperCase()}`, vendorId, reason);
    return res.rows[0];
  }

  async getPendingProducts() {
    const res = await this.db.query(
      `SELECT p.*, b.brand_name as brand_name, v.shop_name
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN vendors v ON p.vendor_id = v.id
       WHERE p.listing_status = 'pending'
       ORDER BY p.created_at ASC`
    );
    return res.rows;
  }

  async verifyProduct(admin: AuthenticatedUser, productId: string, approve: boolean, reason?: string) {
    const status = approve ? 'verified' : 'rejected';
    const res = await this.db.query(
      `UPDATE products 
       SET listing_status = $1, rejection_reason = $2 
       WHERE id = $3 RETURNING *`,
      [status, reason || null, productId]
    );

    await this.logAction(admin.id, `VERIFY_PRODUCT_${status.toUpperCase()}`, productId, reason);
    return res.rows[0];
  }

  async getPendingLifts() {
    // 1. Check LiftsService live submissions
    const liveSubs = await this.liftsService.getPendingLifts();
    if (liveSubs.length > 0) {
      return liveSubs;
    }

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

  async refereeLift(admin: AuthenticatedUser, setId: string, approve: boolean, notes?: string) {
    const status = approve ? 'verified' : 'rejected';
    const liftRecord = await this.liftsService.updateLiftStatus(setId, status, notes);

    const res = await this.db.query(
      `UPDATE lift_sets 
       SET status = $1, rejection_reason = $2, verified_at = NOW() 
       WHERE id = $3 RETURNING *`,
      [status, notes || null, setId]
    );

    const targetLift = liftRecord || res.rows[0];
    if (targetLift && targetLift.video_url) {
      this.logger.log(`⏳ Referee decision on lift ${setId}. Scheduling Cloudflare R2 video deletion in 10 minutes (URL: ${targetLift.video_url})`);
      this.r2Service.scheduleVideoDeletion(targetLift.video_url, 10);
    }

    await this.logAction(admin?.id, `REFEREE_LIFT_${status.toUpperCase()}`, setId, notes);
    return targetLift;
  }

  async getAnalytics() {
    const usersCount = await this.db.query(`SELECT role, COUNT(*) FROM users GROUP BY role`);
    const gymsCount = await this.db.query(`SELECT verification_status, COUNT(*) FROM gyms GROUP BY verification_status`);
    const verifiedLiftsCount = await this.db.query(`SELECT COUNT(*) FROM lift_sets WHERE status = 'verified'`);

    return {
      users: usersCount.rows,
      gyms: gymsCount.rows,
      verifiedLifts: verifiedLiftsCount.rows[0]?.count || 0,
    };
  }

  async getAuditLogs() {
    const res = await this.db.query(
      `SELECT a.*, u.display_name as admin_name, u.email as admin_email
       FROM admin_audit_log a
       LEFT JOIN users u ON a.admin_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 100`
    );
    return res.rows;
  }

  private async logAction(adminId: string, action: string, targetId?: string, notes?: string) {
    if (!adminId) throw new Error('adminId is required to log action');
    try {
      await this.db.query(
        `INSERT INTO admin_audit_log (admin_id, action, target_id, notes) VALUES ($1, $2, $3, $4)`,
        [adminId, action, targetId || null, notes || null]
      );
    } catch (_: any) {}
  }
}
