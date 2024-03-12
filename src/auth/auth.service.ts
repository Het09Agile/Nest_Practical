import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginData, createUserDto } from './dtos/userData.type';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async signup(userdata: createUserDto) {
    try {
      let { password } = userdata;

      // Password hashing
      let decPassword = await bcrypt.hash(password, 10);
      let decUser = { ...userdata, password: decPassword };
      const user = await this.userModel.create(decUser);

      // JWT Token generation
      let payload = { email: user.email, userId: user._id };
      let token = await this.jwtService.signAsync(payload);

      return {
        status: 'success',
        token,
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }

  async login(data: LoginData) {
    try {
      let user = await this.userModel.findOne({ email: data.email });

      if (user && (await bcrypt.compare(data.password, user.password))) {
        // JWT Token generation
        let payload = { email: user.email, userId: user._id };
        let token = await this.jwtService.signAsync(payload);
        return {
          status: 'success',
          token,
        };
      }

      return {
        status: 'fail',
        message: 'Incorrect email or Passwword',
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
      };
    }
  }
}
