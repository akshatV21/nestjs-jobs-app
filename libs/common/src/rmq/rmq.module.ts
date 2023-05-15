import { DynamicModule, Module } from '@nestjs/common'
import { RmqService } from './rmq.service'
import { Service } from 'utils/types'
import { ClientsModule, ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(services: Service[]): DynamicModule {
    return {
      global: true,
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync(
          services.map(service => ({
            name: service,
            useFactory: configService => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get('RMQ_URL')],
                queue: configService.get(`RMQ_${service}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          })),
        ),
      ],
      exports: [ClientsModule],
    }
  }
}
