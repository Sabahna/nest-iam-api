import { NestFactory } from "@nestjs/core";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { protoRoot, serverProtos } from "./utils/protos";

async function application() {
  const url = process.env.IAM_GRPC_URL ?? `127.0.0.1:${process.env.PORT ?? 5010}`;
  const grpcPackages = [...new Set(serverProtos.map((proto) => proto.packageName))];
  const grpcProtoPaths = serverProtos.map((proto) => proto.path);

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url,
      package: grpcPackages,
      protoPath: grpcProtoPaths,
      loader: {
        includeDirs: [protoRoot],
        longs: Number,
        defaults: true,
        arrays: true,
      },
    },
  });

  await app.init();
  await app.startAllMicroservices();

  console.log(`IAM gRPC service is running on ${url}`);
}

void application();
