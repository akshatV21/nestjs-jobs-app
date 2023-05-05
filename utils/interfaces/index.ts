import { CompanyDocument, UserDocument } from '@lib/common'

export interface HttpSuccessResponse {
  success: true
  message: string
  data?: any
}

export interface AuthOptions {
  isLive?: boolean
  isOpen?: boolean
  target?: string
}

export interface AuthPayload {
  token: string
  target: string
  user?: UserDocument
  company?: CompanyDocument
}
