import { Injectable } from '@nestjs/common'
import { RegisterUserDto } from './dtos/register-user.dto'
import { RegisterCompanyDto } from './dtos/register-company.dto'
import { CompanyRepository, UserRepository } from '@lib/common'

@Injectable()
export class AuthService {
  constructor(private readonly UserRepository: UserRepository, private readonly CompanyRepository: CompanyRepository) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    await this.UserRepository.create(registerUserDto)
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    await this.CompanyRepository.create(registerCompanyDto)
  }
}
