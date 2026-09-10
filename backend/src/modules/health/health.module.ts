import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from '../../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [DatabaseModule, RedisModule, FirebaseModule, R2Module],
  controllers: [HealthController],
})
export class HealthModule {}
