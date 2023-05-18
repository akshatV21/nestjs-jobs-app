import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { Auth } from '@lib/common'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'
import { Types } from 'mongoose'
import { CanAccessChat } from '../chat/guards/can-access-chat.guard'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @Auth({ target: 'both' })
  @UseGuards(CanAccessChat)
  async httpGetChatMessages(@Query('id', ParseObjectId) chatId: Types.ObjectId) {
    const messages = await this.messagesService.get(chatId)
    return { success: true, message: 'Chat messages fetched successfully', data: { messages } }
  }
}
