import { CompanyRepository, UserRepository } from '@lib/common'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { verify } from 'jsonwebtoken'
import { Types } from 'mongoose'
import { EXCEPTION_MSGS } from 'utils/constants'
import { AuthPayload } from 'utils/interfaces'

@Injectable()
export class AuthorizeRPC implements CanActivate {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly CompanyRepository: CompanyRepository,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToRpc().getData<AuthPayload>()

    const token = data.token
    if (!token) throw new RpcException(EXCEPTION_MSGS.NULL_TOKEN)

    const { id, target } = this.validateToken(token)

    if (data.type === 'rpc') return true
    if (data.type === 'ws') {
      data.entityId = id
      return true
    }
    
    if (data.target !== 'both' && data.target !== target) throw new RpcException(EXCEPTION_MSGS.UNAUTHORIZED)

    if (data.target === 'user') data.user = await this.UserRepository.findById(new Types.ObjectId(id))
    else if (data.target === 'company') data.company = await this.CompanyRepository.findById(new Types.ObjectId(id))
    else if (data.target === 'both' && target === 'user')
      data.user = await this.UserRepository.findById(new Types.ObjectId(id))
    else if (data.target === 'both' && target === 'company')
      data.company = await this.CompanyRepository.findById(new Types.ObjectId(id))

    if (!data[target]) throw new RpcException('Invalid Token.')

    data.target = target
    return true
  }

  private validateToken(token: string): any {
    return verify(token, this.configService.get(`JWT_SECRET`), (err, payload) => {
      // when jwt is valid
      if (!err) return payload

      // when jwt has expired
      if (err.name === 'TokenExpiredError') throw new RpcException(EXCEPTION_MSGS.JWT_EXPIRED)

      // throws error when jwt is malformed
      throw new RpcException(EXCEPTION_MSGS.INVALID_JWT)
    })
  }
}
