import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductService', () => {
  let service: ProductService;
  let productDB = {
    name: 'name',
    price: expect.any(Number),
    description: 'description',
    owner: 'userId',
    _id: 'productID',
    __v: 0,
  };
  const mockProductModel = {
    find: jest.fn(() => Promise.resolve(['list of all products'])),
    create: jest.fn((product) =>
      Promise.resolve({ _id: 'userId', __v: 0, ...product }),
    ),
    findById: jest.fn((prodId: string) => Promise.resolve(productDB)),
    findByIdAndDelete: jest.fn((prodId: string) => Promise.resolve()),
    findByIdAndUpdate: jest.fn((prodId, prodData) =>
      Promise.resolve(productDB),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all product', async () => {
    let prods = await mockProductModel.find();

    expect(prods).toEqual(['list of all products']);

    let res = await service.getAllProduct();

    expect(res).toEqual({
      status: 'success',
      products: ['list of all products'],
      length: 1,
    });
  });

  it('should add product if you have jwt token', async () => {
    let product = {
      name: 'name',
      price: expect.any(Number),
      description: 'description',
      owner: 'userId',
    };
    let prod = await mockProductModel.create(product);
    expect(prod).toEqual({ _id: 'userId', __v: 0, ...prod });

    expect(await service.createProduct('userId', product)).toEqual({
      status: 'success',
      newProduct: prod,
    });
  });

  it('should delete product if product belongs to user', async () => {
    let prod = await mockProductModel.findById('prodId');
    expect(prod).toEqual(productDB);

    expect(await service.deleteProduct('productId', 'userId')).toBeUndefined();
  });

  it('should update product if user is authenticate', async () => {
    let prod = await mockProductModel.findById('prodId');
    expect(prod).toEqual(productDB);
    let prodNewData = {
      name: 'name',
      price: expect.any(Number),
      description: 'description',
    };
    let updatedProd = await mockProductModel.findByIdAndUpdate(
      'prodId',
      prodNewData,
    );
    expect(updatedProd).toEqual(productDB);
  });
});
