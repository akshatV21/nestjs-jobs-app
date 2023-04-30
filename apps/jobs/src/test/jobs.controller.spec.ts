import { Test, TestingModule } from '@nestjs/testing'
import { JobsController } from '../jobs.controller'
import { JobsService } from '../jobs.service'

describe('JobsController', () => {
  let jobsController: JobsController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsService],
    }).compile()

    jobsController = app.get<JobsController>(JobsController)
  })
})
