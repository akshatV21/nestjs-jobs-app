import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { SERVICES } from 'utils/constants'
import { CreateJobDto } from './dtos/create-job.dto'
import { lastValueFrom, map } from 'rxjs'
import { JobRepository } from '@lib/common/database/repositories/job.repository'
import { CompanyDocument, CompanyRepository, PaymentDto, UserDocument, UserRepository } from '@lib/common'
import { Types } from 'mongoose'

@Injectable()
export class JobsService {
  constructor(
    @Inject(SERVICES.PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
    private readonly JobRepository: JobRepository,
    private readonly CompanyRepository: CompanyRepository,
    private readonly UserRepository: UserRepository,
  ) {}

  async create(createJobDto: CreateJobDto, company: CompanyDocument, token: string) {
    const payment = await lastValueFrom(this.paymentClient.send('new-payment', { ...createJobDto.payment, token }))

    const jobObjectId = new Types.ObjectId()

    const companyUpdatePromise = this.CompanyRepository.update(company._id, { $push: { postings: jobObjectId } })
    const jobCreatePromise = this.JobRepository.create(
      { ...createJobDto, company: company._id, transactionId: payment.id },
      jobObjectId,
    )

    const [post] = await Promise.all([jobCreatePromise, companyUpdatePromise])
    return post
  }

  async getById(id: Types.ObjectId) {
    return await this.JobRepository.findById(
      id,
      {},
      { path: 'company', select: 'name description avatar website state country' },
    )
  }

  async apply(jobPostId: Types.ObjectId, user: UserDocument) {
    if (user.applications.includes(user._id)) throw new BadRequestException('Already applied to this job post.')

    const jobUpdatePromise = this.JobRepository.update(jobPostId, { $push: { applications: user._id } })
    const userUpdatePromise = this.UserRepository.update(user._id, { $push: { applications: jobPostId } })

    await Promise.all([jobUpdatePromise, userUpdatePromise])
  }
}
