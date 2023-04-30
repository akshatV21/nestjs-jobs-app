import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Skill } from 'utils/types'
import { Job } from './job.model'

export type CompanyDocument = Company & Document

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: null })
  avatar?: string

  @Prop({ default: null })
  website: string

  @Prop({ required: true })
  state: string

  @Prop({ required: true })
  country: string

  @Prop({ default: [] })
  postings?: Job[]

  @Prop({ default: [] })
  hired?: []
}

export const CompanySchema = SchemaFactory.createForClass(Company)
