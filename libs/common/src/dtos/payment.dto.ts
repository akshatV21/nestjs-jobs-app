import { Type } from '@nestjs/class-transformer'
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from '@nestjs/class-validator'
import { CardDto } from './card.dto'

export class PaymentDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto

  @IsNumber()
  amount: number
}
