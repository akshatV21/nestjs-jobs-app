import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Chat } from './chat.model'
import { MESSAGE_TYPES } from 'utils/constants'
import { MessageType } from 'utils/types'

export type MessageDocument = Message & Document

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, ref: Chat.name })
  chat: Types.ObjectId

  @Prop({ default: MESSAGE_TYPES[0], type: String })
  type: MessageType

  @Prop({ required: true })
  deadline: Date

  @Prop({ required: true })
  text: string

  @Prop({ default: null })
  attachment: string

  @Prop({ default: null })
  link: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
