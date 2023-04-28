import { Document, FilterQuery, Model, ProjectionType } from 'mongoose'

export abstract class AbstractRepository<T extends Document, S extends Record<string, any>> {
  constructor(protected readonly AbstractModel: Model<T>) {}

  async create(createDto: S): Promise<T> {
    const entity = new this.AbstractModel(createDto)
    return entity.save()
  }

  async find(query: FilterQuery<T>, projection?: ProjectionType<T>): Promise<T[]> {
    const entities = await this.AbstractModel.find(query, projection, { lean: true })
    return entities
  }

  async findOne(query: FilterQuery<T>, projection?: ProjectionType<T>): Promise<T> {
    const entity = await this.AbstractModel.findOne(query, projection, { lean: true })
    return entity
  }
}
