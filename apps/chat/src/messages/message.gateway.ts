import { OnEvent } from '@nestjs/event-emitter'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EVENTS, MESSAGE_STATUS, SERVICES } from 'utils/constants'
import { MessagesSockketSession } from './message-socket-sessions.service'
import { AuthenticatedSocket } from 'utils/interfaces'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MessageRepository } from '@lib/common'
import { Types } from 'mongoose'

@WebSocketGateway()
export class MessagesGateway {
  constructor(
    private readonly socketSessions: MessagesSockketSession,
    private readonly MessageRepository: MessageRepository,
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

  @SubscribeMessage(EVENTS.MESSAGE_RECIEVED)
  async handleMessageRecievedEvent(@MessageBody() data: any) {
    const { message } = data
    const senderId = message.senderId

    const socket = this.socketSessions.getSocket(senderId)
    await this.MessageRepository.update(new Types.ObjectId(senderId), { $set: { status: MESSAGE_STATUS.RECIEVED } })

    socket.emit(EVENTS.MESSAGE_RECIEVED, data)
  }

  @SubscribeMessage(EVENTS.MESSAGE_SEEN)
  async handleMessageSeenEvent(@MessageBody() data: any) {
    const { message } = data
    const senderId = message.senderId

    const socket = this.socketSessions.getSocket(senderId)
    await this.MessageRepository.update(new Types.ObjectId(senderId), { $set: { status: MESSAGE_STATUS.SEEN } })

    socket.emit(EVENTS.MESSAGE_RECIEVED, data)
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
