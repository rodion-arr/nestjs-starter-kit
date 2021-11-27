export const getConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: process.env.LOG_LEVEL || 'info',
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
  cache: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  mail: {
    from: process.env.MAIL_FROM,
    transportOptions: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    },
  },
});

export interface AppConfig {
  port: number;
  jwtSecret: string;
  logLevel: string;
  database: DbConfig;
  cache: CacheConfig;
  mail: MailConfig;
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

export interface MailConfig {
  from: string;
  transportOptions: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
}
