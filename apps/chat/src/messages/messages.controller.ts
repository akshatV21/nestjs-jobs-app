import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { Auth } from '@lib/common'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'
import { Types } from 'mongoose'
import { CanAccessChat } from '../chat/guards/can-access-chat.guard'
import { CreateMessageDto } from './dtos/create-message.dto'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Auth({ target: 'both' })
  @UseGuards(CanAccessChat)
  async httpCreateNewMessage(@Body() createMessageDto: CreateMessageDto, @Req() request: any) {
    const target = request.target
    const entity = request[target]

    const message = this.messagesService.create(createMessageDto, target, entity)
    return { success: true, message: 'Message created successfully', data: { message } }
  }

  @Get()
  @Auth({ target: 'both' })
  @UseGuards(CanAccessChat)
  async httpGetChatMessages(@Query('id', ParseObjectId) chatId: Types.ObjectId) {
    const messages = await this.messagesService.get(chatId)
    return { success: true, message: 'Chat messages fetched successfully', data: { messages } }
  }
}
