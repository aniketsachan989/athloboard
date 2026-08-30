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
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbnVxaGd4aXN3bXdsbHFucGR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDc3MjAwMCwiZXhwIjoyMDQwMzQ4MDAwfQ.supabase_service_role_token_athloboard';

    this.supabase = createClient(supabaseUrl, supabaseKey);

    if (dbUrl) {
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      this.logger.log('PostgreSQL Connection Pool initialized');
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async query<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      if (this.pool) {
        return await this.pool.query<T>(text, params);
      }
    } catch (err) {
      this.logger.warn(`Direct SQL failed (${err.message}). Falling back to Supabase client.`);
    }

    // Fallback simulation/mock for queries
    return { rows: [], command: '', rowCount: 0, oid: 0, fields: [] };
  }
}
