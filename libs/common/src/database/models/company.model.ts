import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Skill } from 'utils/types'
import { Job } from './job.model'
import { hashSync } from 'bcrypt'
import { AbstractSchema } from '../abstract.schema'

export type CompanyDocument = Company & Document

@Schema({ timestamps: true })
export class Company extends AbstractSchema {
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

  @Prop({ default: [], ref: Job.name })
  postings?: Types.ObjectId[]

  @Prop({ default: [] })
  hired?: []
}

const CompanySchema = SchemaFactory.createForClass(Company)

CompanySchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = hashSync(this.password, 4)
  this.password = hashedPassword

  return next()
})

export { CompanySchema }
