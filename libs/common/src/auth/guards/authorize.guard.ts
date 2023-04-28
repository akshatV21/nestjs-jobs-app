import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'
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
    const { isOpen, isLive } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive) throw new InternalServerErrorException('This endpoint is currently under mainatainence.')
    if (isOpen) return true

    const request = context.switchToHttp().getRequest()

    const authHeader = request['authorization']
    if (!authHeader) throw new UnauthorizedException('Please log in first.')

    const token = authHeader.split(' ')[1]

    return this.AuthClient.send('authenticate', { token }).pipe(
      tap(res => {
        console.log(`RESPONSE - ${res}`)
        const target = res.target
        request[target] = res[target]
      }),
      map(() => true),
      catchError(err => {
        console.log('!---------guard error---------!')
        return of(false)
      }),
    )
  }
}
