import { Body, Controller, Post } from "@nestjs/common";
import {
  CreateSessionDto,
  NestIamCoreService,
  Public,
  UpdateSessionDto,
} from "nest-iam";

@Controller("token")
@Public(true)
export class TokenController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  requestToken(@Body() createTokenDto: CreateSessionDto) {
    return this.iamService.requestToken(createTokenDto);
  }

  @Post("refresh")
  refreshToken(@Body() body: UpdateSessionDto) {
    return this.iamService.refreshToken(body);
  }
}
