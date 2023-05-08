import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ParseObjectId implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return new Types.ObjectId(value)
  }
}
