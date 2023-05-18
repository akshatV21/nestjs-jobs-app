import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import {
  Chat,
  ChatRepository,
  ChatSchema,
  DatabaseModule,
  Message,
  MessageRepository,
  MessageSchema,
} from '@lib/common'

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatRepository, MessageRepository],
})
export class MessagesModule {}
