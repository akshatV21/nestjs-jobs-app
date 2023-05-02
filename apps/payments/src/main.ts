import { NestFactory } from '@nestjs/core'
import { PaymentsModule } from './payments.module'
import { RmqService } from '@lib/common'
import { SERVICES } from 'utils/constants'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule)
  const rmqService = app.get<RmqService>(RmqService)

  app.useGlobalPipes(new ValidationPipe())

  app.connectMicroservice(rmqService.getOptions(SERVICES.PAYMENTS_SERVICE))
  await app.startAllMicroservices()
}
bootstrap()
