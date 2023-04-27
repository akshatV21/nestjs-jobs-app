import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import {
  Comapny,
  ComapnySchema,
  CompanyRepository,
  DatabaseModule,
  User,
  UserRepository,
  UserSchema,
} from '@lib/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comapny.name, schema: ComapnySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, CompanyRepository],
})
export class AuthModule {}
