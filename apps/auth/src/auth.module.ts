import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import {
  Company,
  CompanySchema,
  CompanyRepository,
  DatabaseModule,
  User,
  UserRepository,
  UserSchema,
  RmqModule,
  Authorize,
  Chat,
  ChatSchema,
} from '@lib/common'
import { APP_GUARD } from '@nestjs/core'
import { SERVICES } from 'utils/constants'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        RMQ_URL: Joi.string().required(),
        RMQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    RmqModule.register([SERVICES.AUTH_SERVICE]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, CompanyRepository, { provide: APP_GUARD, useClass: Authorize }],
})
export class AuthModule {}
