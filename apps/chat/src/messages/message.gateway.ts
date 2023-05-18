import { OnEvent } from '@nestjs/event-emitter'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EVENTS, SERVICES } from 'utils/constants'
import { MessagesSockketSession } from './message-socket-sessions.service'
import { AuthenticatedSocket } from 'utils/interfaces'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    private readonly socketSessions: MessagesSockketSession,
    @Inject(SERVICES.NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
  ) {}

  @WebSocketServer()
  server: Server

  handleConnection(socket: AuthenticatedSocket) {
    this.socketSessions.setSocket(socket.entityId, socket)
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.socketSessions.removeSocket(socket.entityId)
  }

  @OnEvent(EVENTS.MESSAGE_CREATED)
  handleMessageCreatedEvent(data: any) {
    const { chat, message, reciever } = data

    const recieverId = chat[reciever]._id
    const socket = this.socketSessions.getSocket(recieverId)

    if (socket) socket.emit(EVENTS.MESSAGE_CREATED, message)
    else this.notificationsService.emit(EVENTS.MESSAGE_CREATED, data)
  }
}
