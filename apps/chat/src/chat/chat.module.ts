import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import {
  Chat,
  ChatSchema,
  Company,
  CompanySchema,
  DatabaseModule,
  Job,
  JobSchema,
  User,
  UserRepository,
  UserSchema,
  JobRepository,
  ChatRepository,
} from '@lib/common'

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, UserRepository, JobRepository, ChatRepository],
})
export class ChatModule {}
