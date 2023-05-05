import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { SERVICES } from 'utils/constants'
import { CreateJobDto } from './dtos/create-job.dto'
import { map } from 'rxjs'
import { JobRepository } from '@lib/common/database/repositories/job.repository'
import { CompanyDocument, PaymentDto } from '@lib/common'
import { RpcDto } from '@lib/common/dtos/rpc.dto'

@Injectable()
export class JobsService {
  constructor(
    @Inject(SERVICES.PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
    private readonly JobRepository: JobRepository,
  ) {}

  create(createJobDto: CreateJobDto, company: CompanyDocument, token: string) {
    return this.paymentClient.send<any, PaymentDto>('new-payment', { ...createJobDto.payment }).pipe(
      map(res => {
        return this.JobRepository.create({ ...createJobDto, company: company._id, transactionId: res.id })
      }),
    )
  }
}
