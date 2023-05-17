import { Controller } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { Auth } from '@lib/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { NOTIFICATION_EVENTS } from 'utils/constants'

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService, private eventEmitter: EventEmitter2) {}

  @EventPattern('new-chat')
  @Auth({ target: 'company' })
  notifyNewChatCreated(@Payload() payload: any) {
    this.eventEmitter.emit(NOTIFICATION_EVENTS.CHAT_CREATED, payload)
  }
}
