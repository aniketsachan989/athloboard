import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class VendorsBrandsService {
  constructor(private readonly db: DatabaseService) {}

  async checkGstinUnique(gstin: string) {
    const vCheck = await this.db.query('SELECT id FROM vendors WHERE gstin = $1', [gstin]);
    const bCheck = await this.db.query('SELECT id FROM brands WHERE gstin = $1', [gstin]);
    if (vCheck.rows.length > 0 || bCheck.rows.length > 0) {
      throw new ConflictException('GSTIN is already registered in the system (must be globally unique across vendors and brands)');
    }
  }

  async registerVendor(owner: AuthenticatedUser, data: any) {
    await this.checkGstinUnique(data.gstin);

    const res = await this.db.query(
      `INSERT INTO vendors (
        owner_user_id, shop_name, owner_name, website_url, contact_number,
        email, gstin, address, landmark, latitude, longitude, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
      RETURNING *`,
      [
        owner.id, data.shop_name, data.owner_name || owner.display_name || 'Vendor', data.website_url || null,
        data.contact_number || '', data.email || owner.email, data.gstin, data.address || '',
        data.landmark || '', data.latitude || null, data.longitude || null,
      ]
    );

    await this.db.query(`UPDATE users SET role = 'vendor' WHERE id = $1`, [owner.id]);
    return res.rows[0];
  }

  async registerBrand(owner: AuthenticatedUser, data: any) {
    await this.checkGstinUnique(data.gstin);

    const res = await this.db.query(
      `INSERT INTO brands (
        owner_user_id, brand_name, website_url, linked_gym_id,
        email, gstin, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *`,
      [
        owner.id, data.brand_name, data.website_url, data.linked_gym_id || null,
        data.email || owner.email, data.gstin,
      ]
    );

    await this.db.query(`UPDATE users SET role = 'brand' WHERE id = $1`, [owner.id]);
    return res.rows[0];
  }

  async getMyBusiness(owner: AuthenticatedUser) {
    const vendor = await this.db.query('SELECT * FROM vendors WHERE owner_user_id = $1', [owner.id]);
    const brand = await this.db.query('SELECT * FROM brands WHERE owner_user_id = $1', [owner.id]);
    return {
      vendor: vendor.rows[0] || null,
      brand: brand.rows[0] || null,
    };
  }
}
