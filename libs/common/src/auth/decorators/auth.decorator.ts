import { SetMetadata, createParamDecorator } from '@nestjs/common'
import { AuthOptions } from 'utils/interfaces'

export const Auth = createParamDecorator((data?: AuthOptions) => {
  const metadata: AuthOptions = {
    isLive: data?.isLive ?? true,
    isOpen: data?.isOpen ?? true,
  }

  return SetMetadata('authOptions', metadata)
})
