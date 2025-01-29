import { Module } from "@nestjs/common";
import { ResourceController } from "./resource.controller";

@Module({
  controllers: [ResourceController],
})
export class ResourceModule {}
