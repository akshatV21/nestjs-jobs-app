import { Module } from '@nestjs/common'
import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { Authorize, Company, CompanySchema, DatabaseModule, Job, JobSchema, RmqModule } from '@lib/common'
import { SERVICES } from 'utils/constants'
import { APP_GUARD } from '@nestjs/core'

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
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Job.name, schema: JobSchema },
    ]),
    RmqModule.register([SERVICES.AUTH_SERVICE, SERVICES.JOBS_SERVICE]),
  ],
  controllers: [JobsController],
  providers: [JobsService, { provide: APP_GUARD, useClass: Authorize }],
})
export class JobsModule {}
