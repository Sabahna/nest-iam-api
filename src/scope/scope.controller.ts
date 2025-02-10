import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { NestIamCoreService, Public } from "nest-iam";
import { CreateScopeDto, UpdateScopeDto } from "nest-iam/dist/type/scope";

@Controller("scope")
@Public(true)
export class ScopeController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createScopeDto: CreateScopeDto) {
    return this.iamService.createScope(createScopeDto);
  }

  @Get()
  findAll() {
    return this.iamService.getScopes();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateScopeDto: UpdateScopeDto) {
    return this.iamService.updateScope(id, updateScopeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.iamService.deleteScope(id);
  }
}
