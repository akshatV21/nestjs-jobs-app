import { BadRequestException, Injectable } from '@nestjs/common'
import { RegisterUserDto } from './dtos/register-user.dto'
import { RegisterCompanyDto } from './dtos/register-company.dto'
import { CompanyRepository, UserRepository } from '@lib/common'
import { LoginUserDto } from './dtos/login-user.dto'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { LoginCompanyDto } from './dtos/login-company.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly CompanyRepository: CompanyRepository,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    await this.UserRepository.create(registerUserDto)
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    await this.CompanyRepository.create(registerCompanyDto)
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const registeredUser = await this.UserRepository.findOne({ email: loginUserDto.email })
    if (!registeredUser) throw new BadRequestException('No user with provided email exists.')

    const passwordMatches = compareSync(loginUserDto.password, registeredUser.password)
    if (!passwordMatches) throw new BadRequestException('Invalid password provided.')

    const token = sign({ id: registeredUser._id, target: 'user' }, this.configService.get('JWT_SECRET'), {
      expiresIn: '24h',
    })
    const { password, ...rest } = registeredUser

    return { user: rest, token }
  }

  async loginCompany(loginCompanyDto: LoginCompanyDto) {
    const registeredCompany = await this.CompanyRepository.findOne({ email: loginCompanyDto.email })
    if (!registeredCompany) throw new BadRequestException('No company with provided email exists.')

    const passwordMatches = compareSync(loginCompanyDto.password, registeredCompany.password)
    if (!passwordMatches) throw new BadRequestException('Invalid password provided.')

    const token = sign({ id: registeredCompany._id, target: 'company' }, this.configService.get('JWT_SECRET'), {
      expiresIn: '24h',
    })
    const { password, ...rest } = registeredCompany

    return { company: rest, token }
  }
}
