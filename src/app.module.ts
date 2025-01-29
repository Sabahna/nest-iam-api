import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestIAMModule } from "nest-iam";
import { ScopeModule } from "./scope/scope.module";
import { ResourceModule } from './resource/resource.module';

export const appModules = [ScopeModule];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // NestIAMModule.forRoot({
    //   provider: "mongodb",
    //   url: "mongodb://root:example@localhost:27022/socialmetrica?authSource=admin&replicaSet=rs0&directConnection=true",
    // }),
    NestIAMModule.forRoot({
      provider: "postgresql",
      url: "postgresql://wailwinphyo:wailwinphyo@localhost:5432/postgres",
    }),
    ...appModules,
    ResourceModule,
  ],
})
export class AppModule {}
