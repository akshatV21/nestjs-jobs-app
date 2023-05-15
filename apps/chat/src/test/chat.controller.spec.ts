import { Test, TestingModule } from '@nestjs/testing'
import { ChatController } from '../chat/chat.controller'
import { ChatService } from '../chat.service'

describe('ChatController', () => {
  let chatController: ChatController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    }).compile()

    chatController = app.get<ChatController>(ChatController)
  })
})
