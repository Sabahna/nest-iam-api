import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { NestIamCoreService, Public } from "nest-iam";
import {
  IAM_RESOURCE_SERVICE_NAME,
  type CreateResourceRequest,
  type DeleteResourceRequest,
  type UpdateResourceRequest,
} from "../protobuf/iam/resource.pb";

@Controller()
@Public(true)
export class ResourceController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_RESOURCE_SERVICE_NAME, "createResource")
  createResource(@Payload() payload: CreateResourceRequest) {
    return this.iamService.createResource(payload);
  }

  @GrpcMethod(IAM_RESOURCE_SERVICE_NAME, "getResources")
  async getResources() {
    const items = await this.iamService.getResources();
    return { items };
  }

  @GrpcMethod(IAM_RESOURCE_SERVICE_NAME, "updateResource")
  updateResource(@Payload() payload: UpdateResourceRequest) {
    const { id, ...updateResourceDto } = payload;
    return this.iamService.updateResource(id, updateResourceDto);
  }

  @GrpcMethod(IAM_RESOURCE_SERVICE_NAME, "deleteResource")
  deleteResource(@Payload() payload: DeleteResourceRequest) {
    return this.iamService.deleteResource(payload.id);
  }
}
