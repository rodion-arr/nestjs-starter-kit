import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbConfig } from '../../../../../config/configuration';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, port, user, password, dbName } =
      this.configService.get<DbConfig>('database');

    return {
      type: 'postgres',
      host,
      port,
      username: user,
      password,
      database: dbName,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
