import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { SERVICES } from 'utils/constants'
import { CreateJobDto } from './dtos/create-job.dto'
import { map } from 'rxjs'
import { JobRepository } from '@lib/common/database/repositories/job.repository'
import { CompanyDocument, CompanyRepository, PaymentDto } from '@lib/common'
import { Types } from 'mongoose'

@Injectable()
export class JobsService {
  constructor(
    @Inject(SERVICES.PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
    private readonly JobRepository: JobRepository,
    private readonly CompanyRepository: CompanyRepository,
  ) {}

  create(createJobDto: CreateJobDto, company: CompanyDocument, token: string) {
    return this.paymentClient.send('new-payment', { ...createJobDto.payment, token }).pipe(
      map(async res => {
        const jobObjectId = new Types.ObjectId()

        const companyUpdate = this.CompanyRepository.update(company._id, { $push: { postings: jobObjectId } })
        const jobCreate = this.JobRepository.create(
          {
            ...createJobDto,
            company: company._id,
            transactionId: res.id,
          },
          jobObjectId,
        )

        const [post] = await Promise.all([jobCreate, companyUpdate])
        return post
      }),
    )
  }
}
