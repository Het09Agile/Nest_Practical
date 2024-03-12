import { ApiProperty } from '@nestjs/swagger';

export class createProductDto {
  @ApiProperty({ description: 'product name', example: 'Football07' })
  name: string;
  @ApiProperty({ description: 'product Price', example: 200 })
  price: number;
  @ApiProperty({
    description: 'product description',
    example: 'used to play football with friends',
  })
  description: string;
}
