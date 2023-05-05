import { Controller, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Auth, Authorize, PaymentDto } from '@lib/common'

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @MessagePattern('new-payment')
  @Auth({ target: 'company' })
  @UseGuards(Authorize)
  async createNewPayment(@Payload() paymentDto: PaymentDto) {
    return this.paymentsService.create(paymentDto)
  }
}
