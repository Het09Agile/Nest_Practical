import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { createProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async getAllProduct() {
    try {
      const products = await this.productModel.find();
      return {
        status: 'success',
        length: products.length,
        products,
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }

  async createProduct(userId: string, productData: createProductDto) {
    try {
      const product = { ...productData, owner: userId };
      const newProduct = await this.productModel.create(product);
      return {
        status: 'success',
        newProduct,
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }

  async deleteProduct(prodId: string, userId: string) {
    try {
      let product = await this.productModel.findById(prodId);
      if (product && product.owner.toString() === userId) {
        await this.productModel.findByIdAndDelete(prodId);
        return {
          status: 'success',
        };
      }
      return {
        status: 'fail',
        message: 'Not your product or product not found',
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }

  async updateProduct(
    userId: string,
    prodId: string,
    prodData: UpdateProductDto,
  ) {
    try {
      let product = await this.productModel.findById(prodId);
      if (product && product.owner.toString() === userId) {
        let updatedProduct = await this.productModel.findByIdAndUpdate(
          prodId,
          prodData,
          { new: true },
        );
        return {
          status: 'success',
          updatedProduct,
        };
      }
      return {
        status: 'fail',
        message: 'Not your product or product not found',
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }
}
