import { ChatRepository } from '@lib/common'
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { Target } from 'utils/types'

@Injectable()
export class CanAccessChat implements CanActivate {
  constructor(private readonly ChatRepository: ChatRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const target: Target = request.target
    const entity = request[target]
    const chatId = new Types.ObjectId(request.query.id ?? request.body.chat)

    const chat = await this.ChatRepository.findById(chatId)

    if (!chat) throw new BadRequestException('Invalid chat id.')
    if (!chat[target].equals(entity._id)) throw new ForbiddenException('You are forbidden to access this chat.')

    return true
  }
}
