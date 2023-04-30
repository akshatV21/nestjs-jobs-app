import { NestFactory } from '@nestjs/core'
import { JobsModule } from './jobs.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import * as morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(JobsModule)
  const configService = app.get<ConfigService>(ConfigService)

  const PORT = configService.get('PORT')

  app.useGlobalPipes(new ValidationPipe())

  app.use(helmet())
  app.use(morgan('dev'))

  await app.listen(PORT, () => console.log(`Listening to requests on port: ${PORT}`))
}
bootstrap()
