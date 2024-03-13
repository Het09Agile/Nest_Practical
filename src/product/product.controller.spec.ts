import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
describe('ProductController', () => {
  let controller: ProductController;
  const product = {
    name: 'name',
    price: expect.any(Number),
    description: 'description of product',
  };
  const mockProductService = {
    getAllProducts: jest.fn(() => {
      return {
        status: 'success',
        length: 12,
        products: ['Products Array'],
      };
    }),

    createProduct: jest.fn((product) => {
      return { ...product, __v: expect.any(Number), _id: 'product id' };
    }),

    deleteProduct: jest.fn((req, id) => {
      return {};
    }),

    modifyProduct: jest.fn((body, prodId, req) => {
      return { ...product, __v: expect.any(Number), _id: 'product id' };
    }),
  };
  const mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();
    controller = module.get<ProductController>(ProductController);
  });

  it('should be done', () => {
    expect(controller).toBeDefined();
  });

  it('should return All Products', () => {
    expect(mockProductService.getAllProducts()).toEqual({
      status: 'success',
      length: 12,
      products: ['Products Array'],
    });
  });

  it('should create and return product', () => {
    expect(mockProductService.createProduct(product)).toEqual({
      ...product,
      _id: 'product id',
      __v: 0,
    });
  });

  it('should delete product', () => {
    let req: Request;
    expect(mockProductService.deleteProduct(req, 'ProductID')).toEqual({});
  });

  it('should return updated product details', () => {
    let req: Request;
    expect(mockProductService.modifyProduct(product, 'prodId', req)).toEqual({
      ...product,
      _id: 'product id',
      __v: 0,
    });
  });
});
