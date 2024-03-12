import { Model } from 'mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('ProductController', () => {
  let productController: ProductController;
  const mockProductService = {};
  const mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, AuthGuard],
    })
      //   .overrideProvider([ProductService, AuthGuard])
      //   .useValue([mockProductService, mockAuthGuard])
      .compile();
    productController = module.get<ProductController>(ProductController);
  });

  it('should be done', () => {
    expect(productController).toBeDefined();
  });
});
