import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator'
import { GENDERS, SKILLS } from 'utils/constants'
import { Gender, Skill } from 'utils/types'

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsOptional()
  @IsIn(GENDERS)
  gender: Gender

  @IsOptional()
  @IsIn(SKILLS, { each: true })
  skills: Skill[]
}
