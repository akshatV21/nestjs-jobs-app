import { IsArray, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from '@nestjs/class-validator'
import { JOB_TYPES, SKILLS } from 'utils/constants'
import { JobType, Skill } from 'utils/types'

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
  @IsEnum(JOB_TYPES)
  type: JobType

  @IsOptional()
  @IsArray()
  @IsEnum(SKILLS, { each: true })
  tags: Skill[]
}
