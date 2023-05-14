import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from './company.model'
import { User } from './user.model'
import { Job } from './job.model'

export type ChatDocument = Chat & Document

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, ref: Company.name })
  company: Types.ObjectId

  @Prop({ required: true, ref: User.name })
  user: Types.ObjectId

  @Prop({ required: true, ref: Job.name })
  job: Types.ObjectId

  @Prop({ required: true, ref: Job.name })
  messages: Types.ObjectId[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
