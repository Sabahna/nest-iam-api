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
  DeleteUserRoleDto,
  NestIamCoreService,
  Public,
  UpdateUserDto,
  UserRoleDto,
} from "nest-iam";

@Controller("users")
@Public(true)
export class UserController {
  constructor(private readonly iamService: NestIamCoreService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.iamService.createUser(createUserDto);
  }

  @Get()
  @ApiQuery({ name: "uuid", type: String, required: false })
  findAll(@Query() query: { uuid?: string }) {
    return this.iamService.getUsers(query.uuid);
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
  @ApiQuery({
    name: "role_id",
    type: String,
    required: false,
  })
  removeRoleFromUser(
    @Param("id") id: string,
    @Query() query: { uuid?: string; role_id?: string },
  ) {
    const userRole = new DeleteUserRoleDto();
    userRole.role_id = query.role_id;
    userRole.user_id = id;
    if (query.uuid) {
      userRole.uuid = query.uuid;
    }

    return this.iamService.deleteRoleFromUser(userRole);
  }
}
