import { IsEmail, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator'

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsOptional()
  @IsString()
  website: string

  @IsNotEmpty()
  @IsString()
  state: string

  @IsNotEmpty()
  @IsString()
  country: string
}
