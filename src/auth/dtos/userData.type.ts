import { ApiProperty } from '@nestjs/swagger';

export class LoginData {
  @ApiProperty({ description: 'email is required', example: 'het@gmail.com' })
  email: string;
  @ApiProperty({ description: 'Password is required', example: 'Het@9111' })
  password: string;
}

export class createUserDto {
  @ApiProperty({ description: 'user Name', example: 'Het' })
  name: string;
  @ApiProperty({ description: 'username', example: 'Het09' })
  username: string;
  @ApiProperty({ description: 'user password', example: 'Het@9111' })
  password: string;
  @ApiProperty({ description: 'User Email', example: 'het@gmail.com' })
  email: string;
}
