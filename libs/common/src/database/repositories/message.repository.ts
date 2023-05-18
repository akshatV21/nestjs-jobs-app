import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message, MessageDocument } from '../models'

@Injectable()
export class MessageRepository extends AbstractRepository<MessageDocument, Message> {
  constructor(@InjectModel(Message.name) MessageModel: Model<MessageDocument>) {
    super(MessageModel)
  }
}
