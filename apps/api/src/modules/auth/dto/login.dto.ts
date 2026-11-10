import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@icms.ac.id', description: 'Username or Email' })
  @IsNotEmpty({ message: 'Username atau Email wajib diisi' })
  @IsString()
  identifier!: string;

  @ApiProperty({ example: 'AdminPassword123!', description: 'Password' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @IsString()
  password!: string;
}

