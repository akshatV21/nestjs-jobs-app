import { Module } from '@nestjs/common'
import { ChatModule } from './chat/chat.module'
import { MessagesModule } from './messages/messages.module'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { DatabaseModule, Job, JobSchema, RmqModule, User, UserSchema } from '@lib/common'
import { SERVICES } from 'utils/constants'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        RMQ_URL: Joi.string().required(),
        RMQ_AUTH_QUEUE: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    RmqModule.register([SERVICES.AUTH_SERVICE]),
    ChatModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
