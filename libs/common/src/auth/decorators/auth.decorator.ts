import { SetMetadata } from '@nestjs/common'
import { AuthOptions } from 'utils/interfaces'

export const Auth = (data?: AuthOptions) => {
  const metadata: AuthOptions = {
    isLive: data?.isLive ?? true,
    isOpen: data?.isOpen ?? false,
  }

  return SetMetadata('authOptions', metadata)
}
