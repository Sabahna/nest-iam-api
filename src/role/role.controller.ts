import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { OmitType } from "@nestjs/mapped-types";
import { ApiPropertyOptional, ApiQuery } from "@nestjs/swagger";
import {
  CreateRoleDto,
  NestIamCoreService,
  PermissionRoleDto,
  Public,
  UpdateRoleDto,
} from "nest-iam";

export class CreationRoleDto extends OmitType(CreateRoleDto, [
  "options",
] as const) {
  @ApiPropertyOptional({ type: Number, default: 1 })
  isOrgLvl?: number;
}

@Controller("role")
@Public(true)
export class RoleController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createRoleDto: CreationRoleDto) {
    if (createRoleDto.isOrgLvl) {
      createRoleDto["options"] = { isOrgLvl: createRoleDto.isOrgLvl };
    }

    return this.iamService.createRole(createRoleDto);
  }

  @Get()
  @ApiQuery({
    name: "uuid",
    type: String,
    required: false,
  })
  findAll(@Query() query: { uuid?: string }) {
    return this.iamService.getRoles(query.uuid);
  }

  @Get(":id")
  @ApiQuery({
    name: "uuid",
    type: String,
    required: false,
  })
  findOne(@Query() query: { uuid?: string }, @Param("id") id: string) {
    return this.iamService.getRoleById(id, query.uuid);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.iamService.updateRole(id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.iamService.deleteRole(id);
  }

  @Post("permissions")
  addPermissionToRole(@Body() body: PermissionRoleDto) {
    return this.iamService.addPermissionToRole(body);
  }

  @Delete(":id/permissions/:pid")
  deleteRelatedPermission(@Param("id") id: string, @Param("pid") pid: string) {
    const deleteRelatedPermissionDto = new PermissionRoleDto();
    deleteRelatedPermissionDto.role_id = id;
    deleteRelatedPermissionDto.permission_id = pid;
    return this.iamService.deletePermissionFromRole(deleteRelatedPermissionDto);
  }
}
