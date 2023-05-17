import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from './company.model'
import { User } from './user.model'
import { Job } from './job.model'

export type ChatDocument = Chat & Document

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, ref: 'Company' })
  company: Types.ObjectId

  @Prop({ required: true, ref: 'User' })
  user: Types.ObjectId

  @Prop({ required: true, ref: 'Job' })
  job: Types.ObjectId

  @Prop({ ref: 'Job' })
  messages?: Types.ObjectId[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
