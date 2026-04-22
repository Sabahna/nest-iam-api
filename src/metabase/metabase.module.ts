// src/metabase/metabase.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MetabaseController } from "./metabase.controller";

@Module({
  imports: [ConfigModule],
  controllers: [MetabaseController],
})
export class MetabaseModule {}
