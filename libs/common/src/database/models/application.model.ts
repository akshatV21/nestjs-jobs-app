import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractSchema } from '../abstract.schema'
import { Document, Types } from 'mongoose'
import { Job } from './job.model'
import { User } from './user.model'
import { ApplicationStatus } from 'utils/types'
import { APPLICATION_STATUSES } from 'utils/constants'

export type ApplicationDocument = Application & Document

@Schema({ timestamps: true })
export class Application extends AbstractSchema {
  @Prop({ required: true, ref: Job.name })
  job: Types.ObjectId

  @Prop({ required: true, ref: User.name })
  user: Types.ObjectId

  @Prop({ required: true })
  message: string

  @Prop({ default: APPLICATION_STATUSES.IN_PROCESS, type: String })
  status?: ApplicationStatus
}

export const ApplicationSchema = SchemaFactory.createForClass(Application)
