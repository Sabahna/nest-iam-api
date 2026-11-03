import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { CreateRoleDto, NestIamCoreService, Public } from "nest-iam";
import {
  IAM_ROLE_SERVICE_NAME,
  type CreateRoleRequest,
  type DeleteRoleRequest,
  type GetRoleByIdRequest,
  type GetRolesRequest,
  type PermissionRoleRequest,
  type UpdateRoleRequest,
} from "../protobuf/iam/role.pb";

@Controller()
@Public(true)
export class RoleController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "createRole")
  createRole(@Payload() payload: CreateRoleRequest) {
    const { isOrgLvl, ...rest } = payload;
    const createRoleDto: CreateRoleDto = {
      ...rest,
      options: isOrgLvl ? { isOrgLvl } : undefined,
    };

    return this.iamService.createRole(createRoleDto);
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "getRoles")
  async getRoles(@Payload() payload: GetRolesRequest) {
    const items = await this.iamService.getRoles(payload?.uuid);
    return { items };
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "getRoleById")
  getRoleById(@Payload() payload: GetRoleByIdRequest) {
    return this.iamService.getRoleById(payload.id, payload.uuid);
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "updateRole")
  updateRole(@Payload() payload: UpdateRoleRequest) {
    const { id, ...updateRoleDto } = payload;
    return this.iamService.updateRole(id, updateRoleDto);
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "deleteRole")
  deleteRole(@Payload() payload: DeleteRoleRequest) {
    return this.iamService.deleteRole(payload.id);
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "addPermissionToRole")
  async addPermissionToRole(@Payload() payload: PermissionRoleRequest) {
    await this.iamService.addPermissionToRole(payload);
    return {};
  }

  @GrpcMethod(IAM_ROLE_SERVICE_NAME, "deletePermissionFromRole")
  async deletePermissionFromRole(@Payload() payload: PermissionRoleRequest) {
    await this.iamService.deletePermissionFromRole(payload);
    return {};
  }
}
