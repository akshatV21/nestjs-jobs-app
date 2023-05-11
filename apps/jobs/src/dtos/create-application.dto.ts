import { IsNotEmpty, IsString } from '@nestjs/class-validator'

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  message: string
}
