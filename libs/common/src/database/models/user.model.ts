import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { hashSync } from 'bcrypt'
import { Document, Types } from 'mongoose'
import { Gender, Skill } from 'utils/types'
import { AbstractSchema } from '../abstract.schema'
import { Chat } from './chat.model'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User extends AbstractSchema {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: null, type: String })
  gender: Gender

  @Prop({ default: null })
  avatar?: string

  @Prop()
  resume?: string

  @Prop({ default: [] })
  skills?: Skill[]

  @Prop({ default: [] })
  applications?: Types.ObjectId[]

  @Prop({ default: [], ref: 'Chat' })
  chats?: []
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = hashSync(this.password, 4)
  this.password = hashedPassword

  return next()
})

export { UserSchema }
