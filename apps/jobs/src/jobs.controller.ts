import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Auth, CompanyDocument, HttpRedisCacheInterceptor, ReqCompany, ReqUser, Token, UserDocument } from '@lib/common'
import { CreateJobDto } from './dtos/create-job.dto'
import { Types } from 'mongoose'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'
import { map } from 'rxjs'

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

  @Get(':id')
  @Auth({ target: 'company' })
  async httpGetJobPost(@Param('id', ParseObjectId) jobPostId: Types.ObjectId) {
    const jobPost = await this.jobsService.getById(jobPostId)
    return { success: true, message: 'Job post fetched successfully.', data: { job: jobPost } }
  }

  @Post('apply/:id')
  @Auth({ target: 'user' })
  async httpApplyForJob(@Param('id', ParseObjectId) jobPostId: Types.ObjectId, @ReqUser() user: UserDocument) {
    await this.jobsService.apply(jobPostId, user)
    return { success: true, message: 'Applied to job successfully.' }
  }
}
