import { Document, FilterQuery, Model, PopulateOptions, ProjectionType, Types, UpdateQuery } from 'mongoose'

export abstract class AbstractRepository<T extends Document, S extends Record<string, any>> {
  constructor(protected readonly AbstractModel: Model<T>) {}

  async create(createDto: S, id?: Types.ObjectId): Promise<T> {
    const entity = new this.AbstractModel({ ...createDto, _id: id ?? new Types.ObjectId() })
    return entity.save()
  }

  async find(query: FilterQuery<T>, projection?: ProjectionType<T>, populate?: PopulateOptions): Promise<T[]> {
    return await this.AbstractModel.find(query, projection, { lean: true, populate })
  }

  async findOne(query: FilterQuery<T>, projection?: ProjectionType<T>): Promise<T> {
    return this.AbstractModel.findOne(query, projection, { lean: true })
  }

  async findById(id: string | Types.ObjectId, projection?: ProjectionType<T>, populate?: PopulateOptions) {
    return this.AbstractModel.findById(id, projection, { populate })
  }

  async update(id: string | Types.ObjectId, updateDto: UpdateQuery<T>) {
    return this.AbstractModel.findByIdAndUpdate(id, updateDto, { new: true })
  }
}
