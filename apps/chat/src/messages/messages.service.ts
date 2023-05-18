import { MessageRepository } from '@lib/common'
import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class MessagesService {
  constructor(private readonly MessageRepository: MessageRepository) {}

  async get(chatId: Types.ObjectId) {
    return await this.MessageRepository.find({ chat: chatId })
  }
}
