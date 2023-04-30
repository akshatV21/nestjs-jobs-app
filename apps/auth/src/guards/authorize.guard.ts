import { CompanyRepository, UserRepository } from '@lib/common'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { verify } from 'jsonwebtoken'

@Injectable()
export class AuthorizeRPC implements CanActivate {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly CompanyRepository: CompanyRepository,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToRpc().getData()

    const token = data.token
    if (!token) throw new RpcException('No token was provided')

    const { id, target } = this.validateToken(token)
    
    if (target === 'user') data.user = await this.UserRepository.findOne({ _id: id })
    else if (target === 'company') data.company = await this.CompanyRepository.findOne({ _id: id })

    data.target = target
    return true
  }

  private validateToken(token: string): any {
    return verify(token, this.configService.get('USER_JWT_SECRET'), (err, payload) => {
      // when jwt is valid
      if (!err) return payload

      // when jwt has expired
      if (err.name === 'TokenExpiredError') throw new RpcException('Please log in again')

      // throws error when jwt is malformed
      throw new RpcException('Invalid Jwt token')
    })
  }
}
