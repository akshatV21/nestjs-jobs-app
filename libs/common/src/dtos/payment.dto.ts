import { Type } from '@nestjs/class-transformer'
import { IsNotEmpty, IsNotEmptyObject, IsNumber, ValidateNested } from '@nestjs/class-validator'
import { CardDto } from './card.dto'
import { RpcDto } from './rpc.dto'

export class PaymentDto {
  @IsNotEmpty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto

  @IsNotEmpty()
  @IsNumber()
  amount: number
}
