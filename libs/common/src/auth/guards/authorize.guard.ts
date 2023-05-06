import { RpcDto } from '@lib/common/dtos/rpc.dto'
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { Observable, catchError, map, of, tap } from 'rxjs'
import { SERVICES } from 'utils/constants'
import { AuthOptions, AuthPayload } from 'utils/interfaces'
import { Target } from 'utils/types'

@Injectable()
export class Authorize implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICES.AUTH_SERVICE) private readonly AuthClient: ClientProxy,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requestType = context.getType()

    if (requestType === 'http') return this.authorizeHttpRequest(context)
    else if (requestType === 'rpc') return this.authorizeRpcRequest(context)
  }

  private authorizeHttpRequest(context: ExecutionContext) {
    console.log('http')
    const { isOpen, isLive, target } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())
    
    if (!isLive) throw new InternalServerErrorException('This endpoint is currently under mainatainence.')
    if (isOpen) return true
    
    const request = context.switchToHttp().getRequest()
    
    const authHeader = request.headers['authorization']
    if (!authHeader) throw new UnauthorizedException('Please log in first.')

    const token = authHeader.split(' ')[1]
    return this.sendAuthorizeMessage(token, request, target, 'http')
  }

  private authorizeRpcRequest(context: ExecutionContext) {
    console.log('rpc')
    const { isOpen, isLive, target } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new RpcException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToRpc().getData()

    const token = request.token
    return this.sendAuthorizeMessage(token, request, target, 'rpc')
  }

  private sendAuthorizeMessage(token: string, request: any, target: Target, type: ContextType) {
    return this.AuthClient.send<any, AuthPayload>('authorize', { token, target, type }).pipe(
      tap(res => {
        request[target] = res[target]
        request['token'] = token
      }),
      map(() => true),
      catchError(err => {
        console.log(err)
        return of(false)
      }),
    )
  }
}
