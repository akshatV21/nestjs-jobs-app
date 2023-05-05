import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { Authorize, RmqModule } from '@lib/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { APP_GUARD } from '@nestjs/core'
import { SERVICES } from 'utils/constants'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RMQ_URL: Joi.string().required(),
        RMQ_PAYMENTS_QUEUE: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    RmqModule.register([SERVICES.AUTH_SERVICE]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, { provide: APP_GUARD, useClass: Authorize }],
})
export class PaymentsModule {}
