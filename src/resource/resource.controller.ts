import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  CreateResourceDto,
  NestIamCoreService,
  Public,
  UpdateResourceDto,
} from "nest-iam";

@Controller("resource")
@Public(true)
export class ResourceController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.iamService.createResource(createResourceDto);
  }

  @Get()
  findAll() {
    return this.iamService.getResources();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.iamService.updateResource(id, updateResourceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.iamService.deleteResource(id);
  }
}
