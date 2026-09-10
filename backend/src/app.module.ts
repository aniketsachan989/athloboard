import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GymsModule } from './modules/gyms/gyms.module';
import { VendorsBrandsModule } from './modules/vendors-brands/vendors-brands.module';
import { ProductsModule } from './modules/products/products.module';
import { LiftsModule } from './modules/lifts/lifts.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { CommunityModule } from './modules/community/community.module';
import { AdminModule } from './modules/admin/admin.module';
import { R2Module } from './modules/r2/r2.module';
import { RedisModule } from './modules/redis/redis.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    FirebaseModule,
    AuthModule,
    UsersModule,
    GymsModule,
    VendorsBrandsModule,
    ProductsModule,
    LiftsModule,
    RewardsModule,
    CompetitionsModule,
    CommunityModule,
    AdminModule,
    R2Module,
    HealthModule,
  ],
})
export class AppModule {}
