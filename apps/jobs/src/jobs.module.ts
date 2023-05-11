import { Module } from '@nestjs/common'
import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import {
  Application,
  ApplicationSchema,
  Authorize,
  Company,
  CompanyRepository,
  CompanySchema,
  DatabaseModule,
  HttpRedisCacheInterceptor,
  Job,
  JobSchema,
  RedisCacheModule,
  RmqModule,
  User,
  UserRepository,
  UserSchema,
} from '@lib/common'
import { SERVICES } from 'utils/constants'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JobRepository } from '@lib/common/database/repositories/job.repository'
import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { ApplicationRepository } from '@lib/common/database/repositories/application.repository'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        RMQ_URL: Joi.string().required(),
        RMQ_AUTH_QUEUE: Joi.string().required(),
        RMQ_JOBS_QUEUE: Joi.string().required(),
        RMQ_PAYMENTS_QUEUE: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Job.name, schema: JobSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
    RmqModule.register([SERVICES.AUTH_SERVICE, SERVICES.JOBS_SERVICE, SERVICES.PAYMENTS_SERVICE]),
    CacheModule.register({
      store: redisStore as unknown as CacheStore,
      host: 'redis-server',
      port: 6379,
      ttl: 10,
    }),
  ],
  controllers: [JobsController],
  providers: [
    JobsService,
    { provide: APP_GUARD, useClass: Authorize },
    JobRepository,
    CompanyRepository,
    UserRepository,
    ApplicationRepository,
    { provide: APP_INTERCEPTOR, useClass: HttpRedisCacheInterceptor },
  ],
})
export class JobsModule {}
