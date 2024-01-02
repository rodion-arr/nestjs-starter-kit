import { getConfig } from './configuration';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('config helper', () => {
  it('should be defined', () => {
    expect(getConfig).toBeDefined();
  });

  it('should return configs', () => {
    const env = readFileSync(join(process.cwd(), '.env.example'), 'utf8')
      .split('\n')
      .reduce((vars: any, i) => {
        const [variable, value] = i.split('=');
        vars[variable] = value;
        return vars;
      }, {});

    process.env = Object.assign(process.env, env);

    expect(getConfig()).toStrictEqual({
      cache: {
        host: 'localhost',
        password: '',
        port: 6379,
      },
      database: {
        dbName: 'api',
        host: 'localhost',
        password: 'secret',
        port: 5432,
        user: 'postgres',
      },
      appEnv: 'dev',
      jwtSecret: 'secret',
      logLevel: 'debug',
      port: 3000,
      mail: {
        from: 'no-reply@nestjs-starter-kit.smtp.com',
        transportOptions: {
          auth: {
            pass: 'any-password',
            user: 'any-user',
          },
          host: '127.0.0.1',
          port: 1025,
        },
      },
    });
  });
});
