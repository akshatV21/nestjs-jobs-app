import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RmqContext, Transport } from '@nestjs/microservices'
import { Service } from 'utils/types'

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(service: Service, noAck = false) {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RMQ_URL')],
        queue: this.configService.get<string>(`RMQ_${service}_QUEUE`),
        noAck,
      },
    }
  }

  ack(ctx: RmqContext) {
    const channel = ctx.getChannelRef()
    const originalMessage = ctx.getMessage()
    channel.ack(originalMessage)
  }
}
