import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator'

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string

  @IsNumber()
  exp_month: number

  @IsNumber()
  exp_year: number

  @IsCreditCard()
  number: string
}
