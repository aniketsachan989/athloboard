import { Module, Global } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { RolesGuard } from './roles.guard';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../modules/firebase/firebase.module';

@Global()
@Module({
  imports: [DatabaseModule, FirebaseModule],
  controllers: [AuthController],
  providers: [FirebaseAuthGuard, RolesGuard],
  exports: [FirebaseAuthGuard, RolesGuard],
})
export class AuthModule {}
