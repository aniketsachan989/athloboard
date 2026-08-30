import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('verification/gyms')
  async getPendingGyms() {
    return this.adminService.getPendingGyms();
  }

  @Patch('verification/gyms/:id')
  async verifyGym(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.adminService.verifyGym(admin, id, body.approve, body.reason);
  }

  @Get('verification/brands')
  async getPendingBrands() {
    return this.adminService.getPendingBrands();
  }

  @Patch('verification/brands/:id')
  async verifyBrand(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.adminService.verifyBrand(admin, id, body.approve, body.reason);
  }

  @Get('verification/vendors')
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Patch('verification/vendors/:id')
  async verifyVendor(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.adminService.verifyVendor(admin, id, body.approve, body.reason);
  }

  @Get('verification/products')
  async getPendingProducts() {
    return this.adminService.getPendingProducts();
  }

  @Patch('verification/products/:id')
  async verifyProduct(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.adminService.verifyProduct(admin, id, body.approve, body.reason);
  }

  @Get('verification/lifts')
  async getPendingLifts() {
    return this.adminService.getPendingLifts();
  }

  @Patch('verification/lifts/:id')
  async refereeLift(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { approve: boolean; notes?: string },
  ) {
    return this.adminService.refereeLift(admin, id, body.approve, body.notes);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
