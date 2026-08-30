import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AuthenticatedUser } from '../../auth/current-user.decorator';

@Injectable()
export class CommunityService {
  constructor(private readonly db: DatabaseService) {}

  async listFeed() {
    const res = await this.db.query(
      `SELECT p.*, u.display_name, u.profile_photo_url,
              (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = p.id) as comments_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC LIMIT 50`
    );
    return res.rows;
  }

  async createPost(user: AuthenticatedUser, content: string, mediaUrls: string[] = [], liftSetId?: string) {
    const res = await this.db.query(
      `INSERT INTO posts (user_id, content, media_urls, lift_set_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user.id, content, JSON.stringify(mediaUrls), liftSetId || null]
    );
    return res.rows[0];
  }

  async toggleLike(user: AuthenticatedUser, postId: string) {
    const existing = await this.db.query('SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, user.id]);
    if (existing.rows.length > 0) {
      await this.db.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, user.id]);
      return { liked: false };
    } else {
      await this.db.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, user.id]);
      return { liked: true };
    }
  }

  async addComment(user: AuthenticatedUser, postId: string, content: string) {
    const res = await this.db.query(
      `INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [postId, user.id, content]
    );
    return res.rows[0];
  }
}
