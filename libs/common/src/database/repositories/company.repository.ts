import { Injectable } from '@nestjs/common'
import { AbstractRepository } from '../abstract.repository'
import { InjectModel } from '@nestjs/mongoose'
import { Company, CompanyDocument } from '../models'
import { Model } from 'mongoose'

@Injectable()
export class CompanyRepository extends AbstractRepository<CompanyDocument, Company> {
  constructor(@InjectModel(Company.name) CompanyModel: Model<CompanyDocument>) {
    super(CompanyModel)
  }
}
