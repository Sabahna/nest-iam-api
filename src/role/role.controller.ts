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
import { ApiQuery } from "@nestjs/swagger";
import { NestIamCoreService } from "nest-iam";
import {
  CreateRoleDto,
  PermissionRoleDto,
  UpdateRoleDto,
} from "nest-iam/dist/type/role";

@Controller("role")
export class RoleController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
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
  findOne(@Param("id") id: string, @Query() query: { uuid?: string }) {
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

  @Post(":id/permission/:pid")
  addPermissionToRole(@Param("id") id: string, @Param("pid") pid: string) {
    const addPermissionToRoleDto = new PermissionRoleDto();
    addPermissionToRoleDto.role_id = id;
    addPermissionToRoleDto.permission_id = pid;
    return this.iamService.addPermissionToRole(addPermissionToRoleDto);
  }

  @Delete(":id/permission/:pid")
  deleteRelatedPermission(@Param("id") id: string, @Param("pid") pid: string) {
    const deleteRelatedPermissionDto = new PermissionRoleDto();
    deleteRelatedPermissionDto.role_id = id;
    deleteRelatedPermissionDto.permission_id = pid;
    return this.iamService.deletePermissionFromRole(deleteRelatedPermissionDto);
  }
}
