import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { SERVICES } from 'utils/constants'

@Injectable()
export class JobsService {
  constructor(@Inject(SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy) {}
}
