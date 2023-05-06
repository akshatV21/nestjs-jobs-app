import { CompanyDocument, CompanyRepository, UserDocument, UserRepository } from '@lib/common'
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthOptions } from 'utils/interfaces'

@Injectable()
export class UniqueEmailGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly UserRepository: UserRepository,
    private readonly CompanyRepository: CompanyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { target } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())
    const email = context.switchToHttp().getRequest().body.email

    let entity: UserDocument | CompanyDocument
    if (target === 'user') entity = await this.UserRepository.findOne({ email: email })
    else if (target === 'company') entity = await this.CompanyRepository.findOne({ email: email })
    
    if (entity) throw new BadRequestException(`Email is already in use for another ${target}.`)
    return true
  }
}
