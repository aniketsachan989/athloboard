import { Module } from '@nestjs/common';
import { VendorsBrandsController } from './vendors-brands.controller';
import { VendorsBrandsService } from './vendors-brands.service';

@Module({
  controllers: [VendorsBrandsController],
  providers: [VendorsBrandsService],
  exports: [VendorsBrandsService],
})
export class VendorsBrandsModule {}
