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
import {
  CreateUserDto,
  NestIamCoreService,
  Public,
  UpdateUserDto,
  UserRoleDto,
} from "nest-iam";

@Controller("user")
@Public(true)
export class UserController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.iamService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.iamService.getUsers();
  }

  @Get(":id")
  @ApiQuery({
    name: "uuid",
    type: String,
    required: false,
  })
  findOne(@Param("id") id: string, @Query() query: { uuid?: string }) {
    return this.iamService.getUserRole(id, query.uuid);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.iamService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.iamService.deleteUser(id);
  }

  @Post("roles")
  addRoleFromUser(@Body() body: UserRoleDto) {
    return this.iamService.addRoleToUser(body);
  }

  @Delete(":id/roles/:rid")
  @ApiQuery({
    name: "uuid",
    type: String,
    required: false,
  })
  removeRoleFromUser(
    @Param("id") id: string,
    @Param("rid") rid: string,
    @Query() query: { uuid?: string },
  ) {
    const userRole = new UserRoleDto();
    userRole.role_id = rid;
    userRole.user_id = id;
    if (query.uuid) {
      userRole.uuid = query.uuid;
    }

    return this.iamService.deleteRoleFromUser(userRole);
  }
}
