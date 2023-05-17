import { RpcDto } from '@lib/common/dtos/rpc.dto'
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Observable, catchError, map, of, tap } from 'rxjs'
import { EXCEPTION_MSGS, SERVICES } from 'utils/constants'
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
    else return this.authorizeWsRequest(context)
  }

  private authorizeHttpRequest(context: ExecutionContext) {
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
    const { isOpen, isLive, target } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new RpcException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToRpc().getData()

    const token = request.token
    return this.sendAuthorizeMessage(token, request, target, 'rpc')
  }

  private authorizeWsRequest(context: ExecutionContext) {
    const { isOpen, isLive, target } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new WsException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToWs().getClient<Socket>()

    const token = request.handshake.auth.token
    return this.sendAuthorizeMessage(token, request, target, 'ws')
  }

  private sendAuthorizeMessage(token: string, request: any, target: Target, type: ContextType) {
    return this.AuthClient.send<any, AuthPayload>('authorize', { token, target, type }).pipe(
      tap(res => {
        request[res.target] = res[res.target]
        request['token'] = token
        request.target = res.target

        if (type === 'ws') request.entityId = res.entityId
      }),
      map(() => true),
      catchError(err => {
        console.log(err)

        switch (err.message) {
          case EXCEPTION_MSGS.NULL_TOKEN:
            throw type === 'http'
              ? new UnauthorizedException('Please log in first.')
              : new WsException('Please log in first.')
          case EXCEPTION_MSGS.UNAUTHORIZED:
            throw type === 'http'
              ? new ForbiddenException('You are not authorized to access this endpoint.')
              : new WsException('You are not authorized to access this endpoint.')
          case EXCEPTION_MSGS.JWT_EXPIRED:
            throw type === 'http'
              ? new UnauthorizedException('You token has expired. Please log in again.')
              : new WsException('You token has expired. Please log in again.')
        }

        return of(false)
      }),
    )
  }
}
