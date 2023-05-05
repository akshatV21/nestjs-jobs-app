import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Auth, CompanyDocument, ReqCompany, Token } from '@lib/common'
import { CreateJobDto } from './dtos/create-job.dto'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Auth({ target: 'company' })
  httpCreateNewJob(@Body() createJobDto: CreateJobDto, @ReqCompany() company: CompanyDocument, @Token() token: string) {
    return this.jobsService.create(createJobDto, company, token)
  }
}
