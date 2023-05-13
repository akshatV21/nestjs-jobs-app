import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { APPLICATION_STATUSES, SERVICES } from 'utils/constants'
import { CreateJobDto } from './dtos/create-job.dto'
import { lastValueFrom, map } from 'rxjs'
import { JobRepository } from '@lib/common/database/repositories/job.repository'
import { CompanyDocument, CompanyRepository, PaymentDto, UserDocument, UserRepository } from '@lib/common'
import { Types } from 'mongoose'
import { ApplicationRepository } from '@lib/common/database/repositories/application.repository'
import { ApplicationDto } from './dtos/create-application.dto'
import { ApplicationStatus } from 'utils/types'

@Injectable()
export class JobsService {
  constructor(
    @Inject(SERVICES.PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy,
    private readonly JobRepository: JobRepository,
    private readonly CompanyRepository: CompanyRepository,
    private readonly UserRepository: UserRepository,
    private readonly ApplicationRepository: ApplicationRepository,
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

  async get(company: CompanyDocument) {
    return await this.JobRepository.find({ company: company._id })
  }

  async getById(id: Types.ObjectId) {
    return await this.JobRepository.findById(
      id,
      {},
      { path: 'company', select: 'name description avatar website state country' },
    )
  }

  async apply(jobPostId: Types.ObjectId, user: UserDocument, { message }: ApplicationDto) {
    const existingJobApplication = await this.ApplicationRepository.findOne({ job: jobPostId, user: user._id })
    if (existingJobApplication) throw new BadRequestException('You have already applied to this job post.')

    const applicationObjectId = new Types.ObjectId()
    const createApplicationPromise = this.ApplicationRepository.create(
      { job: jobPostId, user: user._id, message },
      applicationObjectId,
    )
    const updateUserPromise = this.UserRepository.update(user._id, { $push: { applications: applicationObjectId } })
    const updateJobPostPromise = this.JobRepository.update(jobPostId, { $push: { applications: applicationObjectId } })

    const [application] = await Promise.all([createApplicationPromise, updateUserPromise, updateJobPostPromise])
    return application
  }

  async getApplications(jobPostId: Types.ObjectId, company: CompanyDocument) {
    const jobPostExists = company.postings.find(postId => jobPostId.equals(postId))
    if (!jobPostExists) throw new ForbiddenException('You are forbidden to make this request.')

    const applications = await this.ApplicationRepository.find({ job: jobPostId })
    return applications
  }

  async getApplication(jobPostId: Types.ObjectId, applicationId: Types.ObjectId, company: CompanyDocument) {
    const jobPostExists = company.postings.find(postId => jobPostId.equals(postId))
    if (!jobPostExists) throw new ForbiddenException('You are forbidden to make this request.')

    const application = await this.ApplicationRepository.findById(applicationId, {}, { path: 'user' })
    return application
  }

  async updateStatus(
    jobPostId: Types.ObjectId,
    applicationId: Types.ObjectId,
    status: ApplicationStatus,
    company: CompanyDocument,
  ) {
    const jobPostExists = company.postings.find(postId => jobPostId.equals(postId))
    if (!jobPostExists) throw new ForbiddenException('You are forbidden to make this request.')

    const newStatus = APPLICATION_STATUSES[status.toUpperCase()]
    if (!newStatus) throw new BadRequestException('Invalid status value.')

    await this.ApplicationRepository.update(applicationId, {
      $set: { status: newStatus },
    })
  }
}
