import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const ReqUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user ?? undefined
})
