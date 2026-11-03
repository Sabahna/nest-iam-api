import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { DeleteUserRoleDto, NestIamCoreService, Public } from "nest-iam";
import {
  IAM_USER_SERVICE_NAME,
  type CreateUserRequest,
  type DeleteUserRequest,
  type DeleteUserRoleRequest,
  type GetUserRoleRequest,
  type GetUsersRequest,
  type UpdateUserRequest,
  type UserRoleRequest,
} from "../protobuf/iam/user.pb";

@Controller()
@Public(true)
export class UserController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_USER_SERVICE_NAME, "createUser")
  createUser(@Payload() payload: CreateUserRequest) {
    return this.iamService.createUser(payload);
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "getUsers")
  async getUsers(@Payload() payload: GetUsersRequest) {
    const items = await this.iamService.getUsers(payload?.uuid);
    return { items };
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "getUserRole")
  getUserRole(@Payload() payload: GetUserRoleRequest) {
    return this.iamService.getUserRole(payload.id, payload.uuid);
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "updateUser")
  updateUser(@Payload() payload: UpdateUserRequest) {
    const { id, ...updateUserDto } = payload;
    return this.iamService.updateUser(id, updateUserDto);
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "deleteUser")
  deleteUser(@Payload() payload: DeleteUserRequest) {
    return this.iamService.deleteUser(payload.id);
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "addRoleToUser")
  async addRoleToUser(@Payload() payload: UserRoleRequest) {
    await this.iamService.addRoleToUser(payload);
    return {};
  }

  @GrpcMethod(IAM_USER_SERVICE_NAME, "deleteRoleFromUser")
  async deleteRoleFromUser(@Payload() payload: DeleteUserRoleRequest) {
    const userRole = new DeleteUserRoleDto();
    userRole.user_id = payload.user_id;
    userRole.role_id = payload.role_id;
    userRole.uuid = payload.uuid;

    await this.iamService.deleteRoleFromUser(userRole);
    return {};
  }
}
