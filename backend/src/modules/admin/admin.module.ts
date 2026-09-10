import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from '../../database/database.module';
import { R2Module } from '../r2/r2.module';
import { LiftsModule } from '../lifts/lifts.module';

@Module({
  imports: [DatabaseModule, R2Module, LiftsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
