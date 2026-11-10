import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'JWT Refresh Token' })
  @IsNotEmpty({ message: 'Refresh token wajib disertakan' })
  @IsString()
  refreshToken!: string;
}

