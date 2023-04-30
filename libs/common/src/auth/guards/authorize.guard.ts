import {
  CanActivate,
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
import { AuthOptions } from 'utils/interfaces'

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
    const { isOpen, isLive } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new InternalServerErrorException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers['authorization']
    if (!authHeader) throw new UnauthorizedException('Please log in first.')

    const token = authHeader.split(' ')[1]
    return this.sendAuthorizeMessage(token, request)
  }

  private authorizeRpcRequest(context: ExecutionContext) {
    const { isOpen, isLive } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new RpcException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToRpc().getData()

    const token = request.token
    return this.sendAuthorizeMessage(token, request)
  }

  private sendAuthorizeMessage(token: string, request: any) {
    return this.AuthClient.send('authorize', { token }).pipe(
      tap(res => {
        const target = res.target
        request[target] = res[target]
        request['token'] = token
      }),
      map(() => true),
      catchError(err => of(false)),
    )
  }
}
