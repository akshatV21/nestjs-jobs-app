import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { Job, JobDocument } from '../models'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class JobRepository extends AbstractRepository<JobDocument, Job> {
  constructor(@InjectModel(Job.name) JobModel: Model<JobDocument>) {
    super(JobModel)
  }
}
