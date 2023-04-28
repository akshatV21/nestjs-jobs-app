export interface HttpSuccessResponse {
  success: true
  message: string
  data?: any
}

export interface AuthOptions {
  isLive: boolean
  isOpen: boolean
}