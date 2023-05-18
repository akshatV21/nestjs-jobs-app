import { ChatDocument, ChatRepository, CompanyDocument, MessageRepository, UserDocument } from '@lib/common'
import { Inject, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { CreateMessageDto } from './dtos/create-message.dto'
import { Target } from 'utils/types'
import { firstLetterUpperCase } from 'utils/functions'
import { EVENTS, SERVICES } from 'utils/constants'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class MessagesService {
  constructor(
    private readonly MessageRepository: MessageRepository,
    private readonly ChatRepository: ChatRepository,
    @Inject(SERVICES.NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
  ) {}

  async create<T extends Target>(
    createMessageDto: CreateMessageDto,
    target: T,
    entity: T extends 'user' ? UserDocument : CompanyDocument,
    chat: ChatDocument,
  ) {
    const messageObjectId = new Types.ObjectId()

    const createMessagePromise = await this.MessageRepository.create(
      { ...createMessageDto, senderId: entity._id, senderModel: firstLetterUpperCase(target) },
      messageObjectId,
    )
    const chatUpdatePromise = await this.ChatRepository.update(createMessageDto.chat, {
      $push: { messages: messageObjectId },
    })

    const [message] = await Promise.all([createMessagePromise, chatUpdatePromise])

    const reciever = target === 'user' ? 'company' : 'user'
    this.notificationsService.emit(EVENTS.MESSAGE_CREATED, { chat, message, reciever })

    return message
  }

  async get(chatId: Types.ObjectId) {
    return await this.MessageRepository.find({ chat: chatId })
  }
}
