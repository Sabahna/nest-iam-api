import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import applicationSwaggerConfig from "./app.api.swagger";
import { AppModule } from "./app.module";

async function application() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await applicationSwaggerConfig(app);
  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");

  console.log("App is running at " + (await app.getUrl()));
}
application();
