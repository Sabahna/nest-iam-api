import { Controller } from "@nestjs/common";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { NestIamCoreService, Public } from "nest-iam";
import {
  IAM_TOKEN_SERVICE_NAME,
  type RefreshTokenRequest,
  type RequestTokenRequest,
} from "../protobuf/iam/token.pb";

@Controller()
@Public(true)
export class TokenController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @GrpcMethod(IAM_TOKEN_SERVICE_NAME, "requestToken")
  requestToken(@Payload() payload: RequestTokenRequest) {
    return this.iamService.requestToken(payload);
  }

  @GrpcMethod(IAM_TOKEN_SERVICE_NAME, "refreshToken")
  refreshToken(@Payload() payload: RefreshTokenRequest) {
    return this.iamService.refreshToken(payload);
  }
}
