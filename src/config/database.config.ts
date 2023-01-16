import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Env } from '../modules/utils/validate-env';

export const databaseConfig = registerAs(
  'databaseConfig',
  (): MongooseModuleOptions => ({
    uri: Env.string('DB_URL'),
  }),
);
