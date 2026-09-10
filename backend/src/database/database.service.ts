import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;
  public supabase: SupabaseClient;

  onModuleInit() {
    const dbUrl = process.env.DATABASE_URL;
    const supabaseUrl = process.env.SUPABASE_URL || 'https://xonuqhgxiswmwllqnpdx.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseKey) {
      this.logger.error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey || '');

    if (dbUrl) {
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      this.pool.on('error', (err) => { this.logger.error('Unexpected error on idle PostgreSQL client', err.stack); });
      this.logger.log('PostgreSQL Connection Pool initialized');
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async query<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    if (this.pool) {
      return await this.pool.query<T>(text, params);
    }
    throw new Error('Database pool is not initialized');
  }
}
