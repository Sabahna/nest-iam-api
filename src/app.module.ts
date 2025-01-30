import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestIAMModule } from "nest-iam";
import { PermissionModule } from "./permission/permission.module";
import { ResourceModule } from "./resource/resource.module";
import { RoleModule } from "./role/role.module";
import { ScopeModule } from "./scope/scope.module";
import { UserModule } from "./user/user.module";

export const appModules = [
  ScopeModule,
  ResourceModule,
  PermissionModule,
  RoleModule,
  UserModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestIAMModule.forRoot({
      provider: process.env["NESTIAM_PROVIDER"]! as any,
      url: process.env["NESTIAM_URL"]!,
    }),
    ...appModules,
  ],
})
export class AppModule {}
