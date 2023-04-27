import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { InjectModel } from '@nestjs/mongoose'
import { Comapny, ComapnyDocument } from '../models'
import { Model } from 'mongoose'

@Injectable()
export class CompanyRepository extends AbstractRepository<ComapnyDocument, Comapny> {
  constructor(@InjectModel(Comapny.name) CompanyModel: Model<ComapnyDocument>) {
    super(CompanyModel)
  }
}
