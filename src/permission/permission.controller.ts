import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { NestIamCoreService } from "nest-iam";
import {
  CreatePermissionDto,
  RelatedPermissionDto,
  UpdatePermissionDto,
} from "nest-iam/dist/type/permission";

@Controller("permission")
export class PermissionController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.iamService.createPermission(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.iamService.getPermissions();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.iamService.updatePermission(id, updatePermissionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.iamService.deletePermission(id);
  }

  @Post("related-permissions")
  relatedPermissionAdd(@Body() body: RelatedPermissionDto) {
    return this.iamService.addRelatedPermission(body);
  }

  @Delete(":id/related-permissions/:rid")
  relatedPremissionRemove(@Param("id") id: string, @Param("rid") rid: string) {
    const createRelatedPermissionDto = new RelatedPermissionDto();
    createRelatedPermissionDto.parent_id = id;
    createRelatedPermissionDto.child_id = rid;
    return this.iamService.deleteRelatedPermission(createRelatedPermissionDto);
  }
}
