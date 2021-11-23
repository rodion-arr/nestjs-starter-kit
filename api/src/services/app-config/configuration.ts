export const getConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  cache: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
});

export interface AppConfig {
  port: number;
  database: DbConfig;
  jwtSecret: string;
  cache: CacheConfig;
  logLevel: string;
}

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
}

export interface CacheConfig {
  host: string;
  port: number;
  password: string;
}
