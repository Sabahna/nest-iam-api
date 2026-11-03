import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { NestIamCoreService, Public } from "nest-iam";
import {
  IAM_SCOPE_SERVICE_NAME,
  type CreateScopeRequest,
  type DeleteScopeRequest,
  type UpdateScopeRequest,
} from "../protobuf/iam/scope.pb";

@Controller()
@Public(true)
export class ScopeController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_SCOPE_SERVICE_NAME, "createScope")
  createScope(@Payload() payload: CreateScopeRequest) {
    return this.iamService.createScope(payload);
  }

  @GrpcMethod(IAM_SCOPE_SERVICE_NAME, "getScopes")
  async getScopes() {
    const items = await this.iamService.getScopes();
    return { items };
  }

  @GrpcMethod(IAM_SCOPE_SERVICE_NAME, "updateScope")
  updateScope(@Payload() payload: UpdateScopeRequest) {
    const { id, ...updateScopeDto } = payload;
    return this.iamService.updateScope(id, updateScopeDto);
  }

  @GrpcMethod(IAM_SCOPE_SERVICE_NAME, "deleteScope")
  deleteScope(@Payload() payload: DeleteScopeRequest) {
    return this.iamService.deleteScope(payload.id);
  }
}
