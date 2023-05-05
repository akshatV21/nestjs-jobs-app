import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Auth } from '@lib/common'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Auth({ target: 'company' })
  httpCreateNewJob() {}
}
