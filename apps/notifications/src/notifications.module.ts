import { Module } from '@nestjs/common'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { SERVICES } from 'utils/constants'
import { Authorize, RmqModule } from '@lib/common'
import { APP_GUARD } from '@nestjs/core'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationsSockketSession } from './notifications-socket-sessions.service'
import { EventEmitterModule } from '@nestjs/event-emitter'

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
    RmqModule.register([SERVICES.AUTH_SERVICE, SERVICES.JOBS_SERVICE, SERVICES.PAYMENTS_SERVICE]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationsSockketSession,
    { provide: APP_GUARD, useClass: Authorize },
  ],
})
export class NotificationsModule {}
