import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { Application, ApplicationDocument } from '../models'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class ApplicationRepository extends AbstractRepository<ApplicationDocument, Application> {
  constructor(@InjectModel(Application.name) ApplicationModel: Model<ApplicationDocument>) {
    super(ApplicationModel)
  }
}
