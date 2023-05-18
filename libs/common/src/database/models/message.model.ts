import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { MESSAGE_STATUS, MESSAGE_TYPES } from 'utils/constants'
import { MessageStatus, MessageType } from 'utils/types'

export type MessageDocument = Message & Document

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Message {
  @Prop({ required: true, ref: 'Chat' })
  chat: Types.ObjectId

  @Prop({ required: true })
  senderId: Types.ObjectId

  @Prop({ required: true })
  senderModel: string

  @Prop({ default: MESSAGE_TYPES[0], type: String })
  type: MessageType

  @Prop()
  deadline?: Date

  @Prop({ required: true })
  text: string

  @Prop({ default: null })
  attachment?: string

  @Prop({ default: null })
  link?: string

  @Prop({ default: MESSAGE_STATUS.SENT, type: String })
  status?: MessageStatus
}

const MessageSchema = SchemaFactory.createForClass(Message)

MessageSchema.virtual('sender', {
  ref: (doc: MessageDocument) => doc.senderModel,
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
})

export { MessageSchema }
