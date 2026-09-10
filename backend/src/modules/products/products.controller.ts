import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listProducts(@Query('category') category?: string) {
    return this.productsService.listVerifiedProducts(category);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async addProduct(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.productsService.addProduct(user, data);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  async updateProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.productsService.updateProduct(user, id, data);
  }
}
