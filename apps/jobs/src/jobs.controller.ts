import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Auth, Authorize, ReqUser, UserDocument } from '@lib/common'

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
}
