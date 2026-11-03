import { resolve } from "path";
import {
  IAM_PERMISSION_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_PERMISSION_PACKAGE_NAME,
} from "../protobuf/iam/permission.pb";
import {
  IAM_RESOURCE_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_RESOURCE_PACKAGE_NAME,
} from "../protobuf/iam/resource.pb";
import {
  IAM_ROLE_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_ROLE_PACKAGE_NAME,
} from "../protobuf/iam/role.pb";
import {
  IAM_SCOPE_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_SCOPE_PACKAGE_NAME,
} from "../protobuf/iam/scope.pb";
import {
  IAM_TOKEN_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_TOKEN_PACKAGE_NAME,
} from "../protobuf/iam/token.pb";
import {
  IAM_USER_SERVICE_NAME,
  IAM_PACKAGE_NAME as IAM_USER_PACKAGE_NAME,
} from "../protobuf/iam/user.pb";

export const protoRoot = resolve(
  process.cwd(),
  "node_modules",
  "sm-protobuf",
  "proto",
);
const proto = (...segments: string[]) => resolve(protoRoot, ...segments);

export const serverProtos = [
  {
    packageName: IAM_SCOPE_PACKAGE_NAME,
    serviceName: IAM_SCOPE_SERVICE_NAME,
    path: proto("iam", "scope.proto"),
  },
  {
    packageName: IAM_RESOURCE_PACKAGE_NAME,
    serviceName: IAM_RESOURCE_SERVICE_NAME,
    path: proto("iam", "resource.proto"),
  },
  {
    packageName: IAM_PERMISSION_PACKAGE_NAME,
    serviceName: IAM_PERMISSION_SERVICE_NAME,
    path: proto("iam", "permission.proto"),
  },
  {
    packageName: IAM_ROLE_PACKAGE_NAME,
    serviceName: IAM_ROLE_SERVICE_NAME,
    path: proto("iam", "role.proto"),
  },
  {
    packageName: IAM_USER_PACKAGE_NAME,
    serviceName: IAM_USER_SERVICE_NAME,
    path: proto("iam", "user.proto"),
  },
  {
    packageName: IAM_TOKEN_PACKAGE_NAME,
    serviceName: IAM_TOKEN_SERVICE_NAME,
    path: proto("iam", "token.proto"),
  },
];
