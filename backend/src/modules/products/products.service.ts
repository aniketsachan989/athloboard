import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DatabaseService) {}

  async listVerifiedProducts(category?: string) {
    let query = `SELECT p.*, v.shop_name, b.brand_name
                 FROM products p
                 LEFT JOIN vendors v ON p.vendor_id = v.id
                 LEFT JOIN brands b ON p.brand_id = b.id
                 WHERE p.listing_status = 'verified'`;
    const params: any[] = [];
    if (category) {
      params.push(category);
      query += ` AND p.category ILIKE $${params.length}`;
    }
    query += ` ORDER BY p.is_sponsored DESC, p.created_at DESC`;
    const res = await this.db.query(query, params);
    return res.rows;
  }

  async getProductById(id: string) {
    const res = await this.db.query(
      `SELECT p.*, v.shop_name, v.contact_number as vendor_contact, b.brand_name, b.website_url as brand_url
       FROM products p
       LEFT JOIN vendors v ON p.vendor_id = v.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.id = $1`,
      [id]
    );
    if (!res.rows[0]) throw new NotFoundException('Product not found');
    return res.rows[0];
  }

  async addProduct(owner: AuthenticatedUser, data: any) {
    // Check if user is a verified vendor or verified brand
    const vendor = await this.db.query('SELECT * FROM vendors WHERE owner_user_id = $1', [owner.id]);
    const brand = await this.db.query('SELECT * FROM brands WHERE owner_user_id = $1', [owner.id]);

    let vendorId: string | null = null;
    let brandId: string | null = null;

    if (vendor.rows[0]) {
      if (vendor.rows[0].is_banned) throw new ForbiddenException('Vendor is banned from listing products');
      if (vendor.rows[0].verification_status !== 'verified') {
        throw new ForbiddenException('Vendor KYC must be verified by admin before listing products');
      }
      vendorId = vendor.rows[0].id;
    } else if (brand.rows[0]) {
      if (brand.rows[0].is_banned) throw new ForbiddenException('Brand is banned from listing products');
      if (brand.rows[0].verification_status !== 'verified') {
        throw new ForbiddenException('Brand KYC must be verified by admin before listing products');
      }
      brandId = brand.rows[0].id;
    } else {
      throw new ForbiddenException('Only registered and verified vendors/brands can list products');
    }

    const res = await this.db.query(
      `INSERT INTO products (
        vendor_id, brand_id, category, product_name, weight,
        servings, price, stock_number, photo_url_1, photo_url_2,
        is_sponsored, listing_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'unverified')
      RETURNING *`,
      [
        vendorId, brandId, data.category, data.product_name, data.weight || null,
        data.servings || null, data.price, data.stock_number || 0,
        data.photo_url_1 || null, data.photo_url_2 || null, data.is_sponsored || false,
      ]
    );
    return res.rows[0];
  }

  async updateProduct(owner: AuthenticatedUser, id: string, data: any) {
    // The DB trigger `trigger_product_edit_reset` will automatically reset `listing_status` to 'unverified'
    const res = await this.db.query(
      `UPDATE products
       SET product_name = COALESCE($1, product_name),
           price = COALESCE($2, price),
           weight = COALESCE($3, weight),
           servings = COALESCE($4, servings),
           category = COALESCE($5, category),
           stock_number = COALESCE($6, stock_number)
       WHERE id = $7 AND (
         vendor_id IN (SELECT id FROM vendors WHERE owner_user_id = $8) OR
         brand_id IN (SELECT id FROM brands WHERE owner_user_id = $8)
       )
       RETURNING *`,
      [data.product_name, data.price, data.weight, data.servings, data.category, data.stock_number, id, owner.id]
    );
    if (res.rows.length === 0) throw new NotFoundException('Product not found or not owned by user');
    return res.rows[0];
  }
}
