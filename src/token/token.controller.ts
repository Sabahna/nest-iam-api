import { Body, Controller, Post } from "@nestjs/common";
import { NestIamCoreService, Public } from "nest-iam";
import { CreateSessionDto, UpdateSessionDto } from "nest-iam/dist/type/session";

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
