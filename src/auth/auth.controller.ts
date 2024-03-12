import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schema/user.schema';
import { LoginData, createUserDto } from './dtos/userData.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    description: 'It will generate JWT token for the authentication',
  })
  @ApiResponse({ status: 201, description: 'It will return jwt token' })
  @ApiResponse({
    status: 400,
    description: 'If user does not exist or password incorrect',
  })
  login(@Body() loginData: LoginData) {
    return this.authService.login(loginData);
  }

  @Post('signup')
  @ApiResponse({ status: 201, description: 'It will return jwt token' })
  @ApiResponse({ status: 400, description: 'Incomplete data' })
  signup(@Body() signupData: createUserDto) {
    return this.authService.signup(signupData);
  }
}
