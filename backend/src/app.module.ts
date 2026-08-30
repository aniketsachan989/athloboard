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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
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
  ],
})
export class AppModule {}
