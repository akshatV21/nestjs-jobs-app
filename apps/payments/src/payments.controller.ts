import { Controller, Get } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PaymentDto } from '@lib/common'

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('new-payment')
  async createNewPayment(@Payload() paymentDto: PaymentDto) {
    return this.paymentsService.create(paymentDto)
  }
}
