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
      .reduce((vars, i) => {
        const [variable, value] = i.split('=');
        vars[variable] = value;
        return vars;
      }, {});

    process.env = Object.assign(process.env, env);

    expect(getConfig()).toStrictEqual({
      cache: {
        host: 'localhost',
        password: 'null',
        port: 6379,
      },
      database: {
        dbName: 'api',
        host: 'db',
        password: '',
        port: 5432,
        user: '',
      },
      jwtSecret: 'secret',
      logLevel: 'debug',
      port: 3000,
    });
  });
});
