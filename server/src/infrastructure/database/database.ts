import { Pool } from 'pg';
import { env } from '../../config/env.js';

export const database = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
