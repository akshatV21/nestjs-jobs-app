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
} from '@lib/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        USER_JWT_SECRET: Joi.string().required(),
        COMPANY_JWT_SECRET: Joi.string().required(),
        RMQ_URL: Joi.string().required(),
        RMQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    RmqModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, CompanyRepository],
})
export class AuthModule {}
