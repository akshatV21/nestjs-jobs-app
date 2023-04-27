import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as morgan from 'morgan'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const configService = app.get<ConfigService>(ConfigService)

  const PORT = configService.get('PORT')

  app.useGlobalPipes(new ValidationPipe())

  app.use(helmet())
  app.use(morgan('dev'))

  await app.listen(PORT, () => console.log(`Listening to requests on port: ${PORT}`))
}
bootstrap()
