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
  findAll() {
    return this.iamService.getRoles();
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

  @Delete(":id/permission/:rid")
  deleteRelatedPermission(@Param("id") id: string, @Param("pid") pid: string) {
    const deleteRelatedPermissionDto = new PermissionRoleDto();
    deleteRelatedPermissionDto.role_id = id;
    deleteRelatedPermissionDto.permission_id = pid;
    return this.iamService.deletePermissionFromRole(deleteRelatedPermissionDto);
  }
}
