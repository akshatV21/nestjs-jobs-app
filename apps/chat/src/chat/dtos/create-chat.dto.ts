import { Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class CreateChatDto {
  @IsNotEmpty()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  job: Types.ObjectId

  @IsNotEmpty()
  @IsMongoId()
  @Type(() => Types.ObjectId)
  user: Types.ObjectId
}
