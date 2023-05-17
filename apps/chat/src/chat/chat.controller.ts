import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Auth, CompanyDocument, ReqCompany, UserDocument } from '@lib/common'
import { CreateChatDto } from './dtos/create-chat.dto'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('new')
  @Auth({ target: 'company' })
  async httpCreateNewChat(@Body() createChatDto: CreateChatDto, @ReqCompany() company: CompanyDocument) {
    const chat = await this.chatService.create(createChatDto, company)
    // const chat = this.chatService.create2()
    return { success: true, message: 'Chat created successfully.', data: { chat } }
  }

  @Get('list')
  @Auth({ target: 'both' })
  async httpGetChatList(@Req() request: any) {
    const target = request.target
    const entity: CompanyDocument | UserDocument = request[target]
    const chats = await this.chatService.list(target, entity, request.query)
    return { success: true, message: 'Chats fetched successfully.', data: { chats } }
  }
}
