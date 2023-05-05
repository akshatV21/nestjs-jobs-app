import { CompanyDocument, UserDocument } from '@lib/common'
import { Target } from 'utils/types'

export interface HttpSuccessResponse {
  success: true
  message: string
  data?: any
}

export interface AuthOptions {
  isLive?: boolean
  isOpen?: boolean
  target?: Target
}

export interface AuthPayload {
  token?: string
  target?: Target
  user?: UserDocument
  company?: CompanyDocument
}
