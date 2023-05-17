import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { SocketSessions } from './socket-sessions.service'
import { AuthenticatedSocket } from 'utils/interfaces'
import { OnEvent } from '@nestjs/event-emitter'
import { NOTIFICATION_EVENTS } from 'utils/constants'

@WebSocketGateway()
export class NotificationsGateway {
  constructor(private readonly socketSessions: SocketSessions) {}

  @WebSocketServer()
  server: Server

  handleConnection(socket: AuthenticatedSocket) {
    this.socketSessions.setSocket(socket.entityId, socket)
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.socketSessions.removeSocket(socket.entityId)
  }

  @OnEvent(NOTIFICATION_EVENTS.CHAT_CREATED)
  emitChatCreatedEvent(data: any) {
    const socket = this.socketSessions.getSocket(data.user)
    if (socket) socket.emit(NOTIFICATION_EVENTS.CHAT_CREATED, data)
  }
}
