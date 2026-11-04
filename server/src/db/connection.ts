
import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'ledgr',
  password: process.env.DB_PASSWORD ?? 'ledgr_password',
  database: process.env.DB_NAME ?? 'ledgr',

  ssl: process.env.DB_SSL === 'true'
    ? { minVersion: 'TLSv1.2' }
    : undefined,

  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00',
  decimalNumbers: true,
  dateStrings: true,
});

export default pool;
