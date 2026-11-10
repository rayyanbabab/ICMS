import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray, IsOptional } from 'class-validator';
import { UserRole } from '@icms/shared';

export class CreateUserDto {
  @ApiProperty({ example: 'budi.santoso@icms.ac.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email!: string;

  @ApiProperty({ example: 'bsantoso' })
  @IsString()
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username!: string;

  @ApiProperty({ example: 'Dr. Budi Santoso, M.Kom.' })
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  fullName!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password!: string;

  @ApiProperty({ example: '08123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: ['LECTURER'] })
  @IsArray()
  @IsNotEmpty({ message: 'Role wajib dipilih' })
  roles!: UserRole[];
}
