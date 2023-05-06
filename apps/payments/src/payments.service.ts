import { PaymentDto } from '@lib/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), { apiVersion: '2022-11-15' })

  async create(paymentDto: PaymentDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({ type: 'card', card: paymentDto.card })
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: paymentDto.amount,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    })
    
    return paymentIntent
  }
}
