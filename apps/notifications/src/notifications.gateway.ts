import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { NotificationsSockketSession } from './notifications-socket-sessions.service'
import { AuthenticatedSocket } from 'utils/interfaces'
import { OnEvent } from '@nestjs/event-emitter'
import { EVENTS } from 'utils/constants'

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly socketSessions: NotificationsSockketSession) {}

  @WebSocketServer()
  server: Server

  handleConnection(socket: AuthenticatedSocket) {
    this.socketSessions.setSocket(socket.entityId, socket)
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.socketSessions.removeSocket(socket.entityId)
  }

  @OnEvent(EVENTS.CHAT_CREATED)
  emitChatCreatedEvent(data: any) {
    const socket = this.socketSessions.getSocket(data.user)
    if (socket) socket.emit(EVENTS.CHAT_CREATED, data)
  }

  @OnEvent(EVENTS.MESSAGE_CREATED)
  emitMessageCreatedEvent(data: any) {
    // send email
  }
}
