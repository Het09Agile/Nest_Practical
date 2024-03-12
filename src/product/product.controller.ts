import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  @ApiResponse({ status: 200, description: 'Return the all the products' })
  getAllProducts() {
    return this.productService.getAllProduct();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 201, description: 'Craete product' })
  @ApiResponse({ status: 400, description: 'Incomplete product details' })
  @ApiResponse({
    status: 401,
    description: 'Not authorized to create product',
  })
  createProduct(@Body() prodData: createProductDto, @Req() req) {
    let userId = req.user.userId;
    return this.productService.createProduct(userId, prodData);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 204, description: 'Product Deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized Action' })
  @ApiBearerAuth()
  @Delete(':id')
  deleteProduct(@Req() req, @Param('id') prodId: string) {
    let userId = req.user.userId;
    return this.productService.deleteProduct(prodId, userId);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 400, description: 'Incomplete product details' })
  @ApiResponse({
    status: 401,
    description: 'Not authorized to create product',
  })
  @ApiBearerAuth()
  @Put(':id')
  modifyProduct(
    @Body() updateProData: UpdateProductDto,
    @Param('id') prodId: string,
    @Req() req,
  ) {
    let userId = req.user.userId;
    return this.productService.updateProduct(userId, prodId, updateProData);
  }
}
