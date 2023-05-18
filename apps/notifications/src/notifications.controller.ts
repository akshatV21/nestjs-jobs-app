import { Controller } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { Auth } from '@lib/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EVENTS } from 'utils/constants'

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService, private eventEmitter: EventEmitter2) {}

  @EventPattern(EVENTS.CHAT_CREATED)
  @Auth({ target: 'company' })
  notifyNewChatCreated(@Payload() payload: any) {
    this.eventEmitter.emit(EVENTS.CHAT_CREATED, payload)
  }

  @EventPattern(EVENTS.MESSAGE_CREATED)
  @Auth({ target: 'both' })
  notifyNewMessageCreated(@Payload() payload: any) {
    this.eventEmitter.emit(EVENTS.MESSAGE_CREATED, payload)
  }
}
