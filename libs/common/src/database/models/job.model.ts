import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from './company.model'
import { JobType, Skill } from 'utils/types'
import { JOB_TYPES } from 'utils/constants'

export type JobDocument = Job & Document

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true, ref: Company.name })
  company: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  body: string

  @Prop({ default: 'unpaid', type: String })
  pay: string

  @Prop({ default: JOB_TYPES[0], type: String })
  type: JobType

  @Prop({ default: [] })
  tags: Skill[]

  @Prop({ default: [] })
  applications: []

  @Prop({ required: true })
  transactionId: string
}

export const JobSchema = SchemaFactory.createForClass(Job)
