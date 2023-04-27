import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator'

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
