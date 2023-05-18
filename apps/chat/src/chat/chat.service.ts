import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { CreateChatDto } from './dtos/create-chat.dto'
import { ChatRepository, CompanyDocument, JobRepository, UserDocument, UserRepository } from '@lib/common'
import { Types } from 'mongoose'
import { Target } from 'utils/types'
import { EVENTS, SERVICES } from 'utils/constants'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class ChatService {
  constructor(
    private readonly JobRepository: JobRepository,
    private readonly UserRepository: UserRepository,
    private readonly ChatRepository: ChatRepository,
    @Inject(SERVICES.NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
  ) {}

  async create(createChatDto: CreateChatDto, company: CompanyDocument) {
    const jobPostExists = company.postings.find(jobPostId => createChatDto.job.equals(jobPostId))
    if (!jobPostExists) throw new ForbiddenException('You are forbidden to make this request.')

    const chatObjectId = new Types.ObjectId()
    const createChatPromise = this.ChatRepository.create({
      company: company._id,
      job: createChatDto.job,
      user: createChatDto.user,
    })
    const jobUpdatePromise = this.JobRepository.update(createChatDto.job, { $push: { chats: chatObjectId } })
    const userUpdatePromise = this.UserRepository.update(createChatDto.user, { $push: { chats: chatObjectId } })

    const [chat] = await Promise.all([createChatPromise, jobUpdatePromise, userUpdatePromise])
    this.notificationsService.emit(EVENTS.CHAT_CREATED, chat)

    return chat
  }

  create2() {
    this.notificationsService.emit('new-chat', { user: '123456' })
    return { user: '123456' }
  }

  async list<T extends Target>(target: T, entity: T extends 'user' ? UserDocument : CompanyDocument, queries: any) {
    if (target === 'user') {
      const chats = await this.ChatRepository.find(
        { user: entity._id },
        {},
        { path: 'company', select: 'name', populate: { path: 'job', select: 'title' } },
      )
      return chats
    } else if (target === 'company') {
      const jobPostId = new Types.ObjectId(queries.jobPostId)
      const chats = await this.ChatRepository.find(
        { company: entity._id },
        {},
        { path: 'user', select: 'firstName lastName email' },
      )
      return chats
    }
  }
}
