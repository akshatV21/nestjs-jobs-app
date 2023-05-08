import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import type { RedisClientOptions } from 'redis'
import * as redisStore from 'cache-manager-redis-store'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 15,
      }),
      inject: [ConfigService],
      // store: redisStore,
      // host: 'redis-server',
      // port: 6379,
      // ttl: 1500,
    }),
  ],
})
export class RedisCacheModule {}
