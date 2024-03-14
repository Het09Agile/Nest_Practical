import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from '../src/product/product.module';
import { getModelToken } from '@nestjs/mongoose';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let productDB = {
    name: 'name',
    price: expect.any(Number),
    description: 'description',
    owner: 'userId',
    _id: 'productID',
    __v: 0,
  };
  const mockAuthGuard = {};
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(getModelToken('Product'))
      .useValue(mockProductModel)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect({
        status: 'success',
        length: 1,
        products: ['list of all products'],
      });
  });

  it('/products (POST)--> All Product if JWT Token', () => {
    let product = { name: 'name', price: 123, description: 'description' };
    return request(app.getHttpServer())
      .post('/products')
      .send(product)
      .set('authorization', 'jwtToken')
      .expect(201)
      .expect({ _id: 'userId', __v: 0, ...product });
  });
});
