import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: configService => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models)
  }
}
