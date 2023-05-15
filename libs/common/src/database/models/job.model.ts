import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from './company.model'
import { JobType, JobTypeLowerCase, Skill } from 'utils/types'
import { JOB_TYPES } from 'utils/constants'
import { AbstractSchema } from '../abstract.schema'
import { Chat } from './chat.model'

export type JobDocument = Job & Document

@Schema({ timestamps: true })
export class Job extends AbstractSchema {
  @Prop({ required: true, ref: 'Company' })
  company: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  body: string

  @Prop({ default: 'unpaid', type: String })
  pay?: string

  @Prop({ default: JOB_TYPES[0], type: String })
  type?: JobTypeLowerCase

  @Prop({ default: [] })
  tags?: Skill[]

  @Prop({ default: [] })
  applications?: Types.ObjectId[]

  @Prop({ required: true })
  transactionId: string

  @Prop({ default: [], ref: 'Chat' })
  chats?: []
}

export const JobSchema = SchemaFactory.createForClass(Job)
