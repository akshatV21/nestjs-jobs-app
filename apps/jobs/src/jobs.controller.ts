import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { JobsService } from './jobs.service'
import {
  Auth,
  Company,
  CompanyDocument,
  HttpRedisCacheInterceptor,
  ReqCompany,
  ReqUser,
  Token,
  UserDocument,
} from '@lib/common'
import { CreateJobDto } from './dtos/create-job.dto'
import { Types } from 'mongoose'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'
import { ApplicationDto } from './dtos/create-application.dto'
import { ApplicationStatus } from 'utils/types'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Auth({ target: 'company' })
  async httpCreateNewJob(
    @Body() createJobDto: CreateJobDto,
    @ReqCompany() company: CompanyDocument,
    @Token() token: string,
  ) {
    const jobPost = await this.jobsService.create(createJobDto, company, token)
    return { success: true, message: 'Job posted successfully.', data: { job: jobPost } }
  }

  @Get()
  @Auth({ target: 'company' })
  async httpGetjobPosts(@ReqCompany() company: CompanyDocument) {
    const jobPosts = await this.jobsService.get(company)
    return { success: true, message: 'Jobs fetched successfully.', data: { jobs: jobPosts } }
  }

  @Get(':id')
  @Auth({ target: 'both' })
  async httpGetJobPost(@Param('id', ParseObjectId) jobPostId: Types.ObjectId) {
    const jobPost = await this.jobsService.getById(jobPostId)
    return { success: true, message: 'Job post fetched successfully.', data: { job: jobPost } }
  }

  @Post(':id/applications')
  @Auth({ target: 'user' })
  async httpApplyForJob(
    @Param('id', ParseObjectId) jobPostId: Types.ObjectId,
    @ReqUser() user: UserDocument,
    @Body() applicationDto: ApplicationDto,
  ) {
    const application = await this.jobsService.apply(jobPostId, user, applicationDto)
    return { success: true, message: 'Applied to job successfully.', data: { application } }
  }

  @Get(':id/applications')
  @Auth({ target: 'company' })
  async httpGetJobApplications(
    @Param('id', ParseObjectId) jobPostId: Types.ObjectId,
    @ReqCompany() company: CompanyDocument,
  ) {
    const applications = await this.jobsService.getApplications(jobPostId, company)
    return { success: true, message: 'Applications fetched successfully', data: { applications } }
  }

  @Get(':jobPostId/applications/:applicationId')
  @Auth({ target: 'company' })
  async httpGetApplication(
    @Param('jobPostId', ParseObjectId) jobPostId: Types.ObjectId,
    @Param('applicationId') applicationId: Types.ObjectId,
    @ReqCompany() company: CompanyDocument,
  ) {
    const application = await this.jobsService.getApplication(jobPostId, applicationId, company)
    return { success: true, message: 'Application fetched successfully', data: { application } }
  }

  @Patch(':jobPostId/applications/:applicationId/status')
  @Auth({ target: 'company' })
  async httpUpdateApplicationStatus(
    @Param('jobPostId', ParseObjectId) jobPostId: Types.ObjectId,
    @Param('applicationId') applicationId: Types.ObjectId,
    @Query('status') status: ApplicationStatus,
    @ReqCompany() company: CompanyDocument,
  ) {
    await this.jobsService.updateStatus(jobPostId, applicationId, status, company)
    return { success: true, message: `Application status successfully changed to ${status}` }
  }
}
