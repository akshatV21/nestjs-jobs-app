import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { Chat, ChatDocument } from '../models'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class ChatRepository extends AbstractRepository<ChatDocument, Chat> {
  constructor(@InjectModel(Chat.name) ChatModel: Model<ChatDocument>) {
    super(ChatModel)
  }
}
