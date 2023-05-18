import { Injectable } from '@nestjs/common'
import { AuthenticatedSocket } from 'utils/interfaces'

@Injectable()
export class NotificationsSockketSession {
  private sessions: Map<string, AuthenticatedSocket> = new Map()

  getSocket(id: string) {
    return this.sessions.get(id)
  }

  setSocket(userId: string, socket: AuthenticatedSocket) {
    this.sessions.set(userId, socket)
  }

  removeSocket(userId: string) {
    this.sessions.delete(userId)
  }
  getSockets(): Map<string, AuthenticatedSocket> {
    return this.sessions
  }
}
