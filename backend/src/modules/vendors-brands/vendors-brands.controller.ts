import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VendorsBrandsService } from './vendors-brands.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/business')
@UseGuards(FirebaseAuthGuard)
export class VendorsBrandsController {
  constructor(private readonly vbService: VendorsBrandsService) {}

  @Get('me')
  async getMyBusiness(@CurrentUser() user: AuthenticatedUser) {
    return this.vbService.getMyBusiness(user);
  }

  @Post('vendor/register')
  async registerVendor(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.vbService.registerVendor(user, data);
  }

  @Post('brand/register')
  async registerBrand(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.vbService.registerBrand(user, data);
  }
}
