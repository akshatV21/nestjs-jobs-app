import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
