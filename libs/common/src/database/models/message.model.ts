import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Chat } from './chat.model'
import { MESSAGE_TYPES } from 'utils/constants'

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, ref: Chat.name })
  chat: Types.ObjectId

  @Prop({ default: MESSAGE_TYPES[0], type: String })
  type: Message

  @Prop({ required: true })
  deadline: Date

  @Prop({ required: true })
  text: string

  attachment: string
}
