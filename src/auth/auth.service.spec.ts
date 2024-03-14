import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

describe('AuthSrvice', () => {
  let service: AuthService;

  const mockJwtSerivce = {
    signAsync: jest.fn().mockImplementation((payload) => 'jwt token'),
  };

  const user = {
    _id: 'userId',
    name: 'name',
    password: '12345678',
    username: 'usename',
    email: 'email',
    __v: 0,
  };

  const mockUserModel = {
    create: jest
      .fn()
      .mockImplementation((dto) =>
        Promise.resolve({ ...dto, __v: 0, _id: 'doc Id' }),
      ),
    findOne: jest.fn().mockImplementation((email) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtSerivce)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user and return jwt token', async () => {
    const dto = {
      email: 'email',
      password: 'password',
      username: 'userame',
      name: 'name',
    };
    expect(await service.signup(dto)).toEqual({
      status: 'success',
      token: 'jwt token',
    });
  });

  it('should return jwt token Login', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    expect(await bcrypt.compare('password', 'hashedpassword')).toEqual(true);
    expect(await mockUserModel.findOne('email')).toEqual({
      _id: 'userId',
      name: 'name',
      password: '12345678',
      username: 'usename',
      email: 'email',
      __v: 0,
    });

    expect(
      await mockJwtSerivce.signAsync({ email: 'email', userId: 'userid' }),
    ).toEqual('jwt token');

    let res = await service.login({ email: 'email', password: 'password' });

    expect(res).toEqual({
      status: 'success',
      token: 'jwt token',
    });
  });

  it('should return fail status and message if user not found', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const result = await service.login({
      email: 'nonexistent@example.com',
      password: 'password',
    });

    expect(result).toEqual({
      status: 'fail',
      message: 'User not exist',
    });
  });
});
