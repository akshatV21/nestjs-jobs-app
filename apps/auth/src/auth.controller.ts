import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from './dtos/register-user.dto'
import { RegisterCompanyDto } from './dtos/register-company.dto'
import { HttpSuccessResponse } from 'utils/interfaces'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  async httpRegisterUser(@Body() registerUserDto: RegisterUserDto): Promise<HttpSuccessResponse> {
    await this.authService.registerUser(registerUserDto)
    return { success: true, message: 'User registered successfully' }
  }

  @Post('register/company')
  async httpRegisterCompany(@Body() registerCompanyDto: RegisterCompanyDto): Promise<HttpSuccessResponse> {
    await this.authService.registerCompany(registerCompanyDto)
    return { success: true, message: 'Company registered successfully' }
  }
}
