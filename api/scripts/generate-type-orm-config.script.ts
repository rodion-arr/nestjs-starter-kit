/**
 * This script generates required config file for running migrations
 * Values are taken from .env file
 */
import * as dotenv from 'dotenv';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getConfig } from '../config/configuration';

dotenv.config();

const configFilePath = join(process.cwd(), 'ormconfig.json');

try {
  // no actions if config file exists
  if (isConfigFileExists()) {
    console.log('DB config file exists: ', configFilePath);
    process.exit(0);
  }

  const {
    database: { host, port, password, user, dbName },
  } = getConfig();

  const dbConfigContent = {
    type: 'postgres',
    host,
    port,
    username: user,
    password,
    database: dbName,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/db/migrations/**/*.ts'],
    subscribers: ['src/db/subscribers/**/*.ts'],
  };

  // write config file
  writeFileSync(configFilePath, JSON.stringify(dbConfigContent, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}

function isConfigFileExists(): boolean {
  return existsSync(configFilePath);
}
