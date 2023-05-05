import { PaymentDto } from '@lib/common'
import { Type } from '@nestjs/class-transformer'
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator'
import { JOB_TYPES, SKILLS } from 'utils/constants'
import { JobTypeLowerCase, Skill } from 'utils/types'

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  body: string

  @IsOptional()
  @IsNumberString()
  pay: string

  @IsOptional()
  @IsEnum(JOB_TYPES.map(type => type.toLowerCase()))
  type: JobTypeLowerCase

  @IsOptional()
  @IsArray()
  @IsEnum(SKILLS, { each: true })
  tags: Skill[]

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto
}
