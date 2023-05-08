import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Auth, CompanyDocument, ReqCompany, Token } from '@lib/common'
import { CreateJobDto } from './dtos/create-job.dto'
import { Types } from 'mongoose'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'
import { map } from 'rxjs'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Auth({ target: 'company' })
  httpCreateNewJob(@Body() createJobDto: CreateJobDto, @ReqCompany() company: CompanyDocument, @Token() token: string) {
    return this.jobsService.create(createJobDto, company, token).pipe(
      map(async jobPost => {
        return { success: true, message: 'Job posted successfully.', data: { job: await jobPost } }
      }),
    )
  }

  @Get(':id')
  @Auth({ target: 'company' })
  async httpGetJobPost(@Param('id', ParseObjectId) jobPostId: Types.ObjectId) {
    const jobPost = await this.jobsService.getById(jobPostId)
    return { success: true, message: 'Job post fetched successfully.', data: { job: jobPost } }
  }
}
