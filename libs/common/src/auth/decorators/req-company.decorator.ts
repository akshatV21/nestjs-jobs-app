import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const ReqCompany = createParamDecorator((data: any, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().company ?? undefined
})
