import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn((dto) => {
      return {
        status: 'success',
        token: 'jwt token',
      };
    }),
    login: jest.fn((logininfo) => {
      return {
        status: 'success',
        token: 'jwt token',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user and rturn jwt Token', () => {
    const dto = {
      name: 'user',
      password: 'user@pass',
      email: 'user@email.com',
      username: 'User.name',
    };

    expect(controller.signup(dto)).toEqual({
      status: 'success',
      token: 'jwt token',
    });

    expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
  });

  it('Authenticate user and return JWT', () => {
    expect(
      controller.login({ email: 'user@email.com', password: 'user@pass' }),
    ).toEqual({
      status: 'success',
      token: 'jwt token',
    });

    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
