import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { Request } from 'express'
import { Observable, of, tap } from 'rxjs'

@Injectable()
export class HttpRedisCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()
    if (request.method !== 'GET') return next.handle()

    const key = this.generateCacheKey(request)
    const cachedResponse = await this.cacheService.get(key)

    if (cachedResponse) return of(cachedResponse)

    return next.handle().pipe(
      tap(async res => {
        console.log('cached')
        await this.cacheService.set(key, res)
      }),
    )
  }

  private generateCacheKey(request: any) {
    const target = request.target
    const entityId = request[target]._id
    const path = request.path

    return `${entityId}-${path}`
  }
}
