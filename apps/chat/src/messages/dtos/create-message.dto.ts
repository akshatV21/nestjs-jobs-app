import { Type } from 'class-transformer'
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'
import { Types } from 'mongoose'
import { MESSAGE_TYPES } from 'utils/constants'
import { MessageType } from 'utils/types'

export class CreateMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  chat: Types.ObjectId

  @IsNotEmpty()
  @IsEnum(MESSAGE_TYPES)
  type: MessageType

  @IsNotEmpty()
  @IsString()
  text: string

  @IsOptional()
  @IsString()
  attachment: string

  @ValidateIf((object, value) => object.type === MESSAGE_TYPES[2])
  @IsString()
  link: string

  @ValidateIf((object, value) => object.type === MESSAGE_TYPES[1])
  @IsDateString()
  @Type(() => Date)
  deadline: Date
}
