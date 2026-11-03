import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { NestIamCoreService, Public } from "nest-iam";
import {
  IAM_PERMISSION_SERVICE_NAME,
  type CreatePermissionRequest,
  type DeletePermissionRequest,
  type RelatedPermissionRequest,
  type UpdatePermissionRequest,
} from "../protobuf/iam/permission.pb";

@Controller()
@Public(true)
export class PermissionController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "createPermission")
  createPermission(@Payload() payload: CreatePermissionRequest) {
    return this.iamService.createPermission(payload);
  }

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "getPermissions")
  async getPermissions() {
    const items = await this.iamService.getPermissions();
    return { items };
  }

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "updatePermission")
  updatePermission(@Payload() payload: UpdatePermissionRequest) {
    const { id, ...updatePermissionDto } = payload;
    return this.iamService.updatePermission(id, updatePermissionDto);
  }

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "deletePermission")
  deletePermission(@Payload() payload: DeletePermissionRequest) {
    return this.iamService.deletePermission(payload.id);
  }

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "addRelatedPermission")
  async addRelatedPermission(@Payload() payload: RelatedPermissionRequest) {
    await this.iamService.addRelatedPermission(payload);
    return {};
  }

  @GrpcMethod(IAM_PERMISSION_SERVICE_NAME, "deleteRelatedPermission")
  async deleteRelatedPermission(@Payload() payload: RelatedPermissionRequest) {
    await this.iamService.deleteRelatedPermission(payload);
    return {};
  }
}
