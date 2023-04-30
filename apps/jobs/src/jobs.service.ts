import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsService {
  getHello(): string {
    return 'Hello World!';
  }
}
