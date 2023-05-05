import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const Token = createParamDecorator((data: any, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().token
})
