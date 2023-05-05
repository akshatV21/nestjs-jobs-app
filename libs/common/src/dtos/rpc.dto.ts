import { IsEnum, IsJWT, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator'
import { ContextType } from '@nestjs/common'
import { TARGETS } from 'utils/constants'
import { Target } from 'utils/types'

export class RpcDto {
  @IsNotEmpty()
  @IsJWT()
  token: string

  @IsOptional()
  @IsEnum(TARGETS)
  target?: Target

  @IsOptional()
  @IsString()
  type?: ContextType
}
