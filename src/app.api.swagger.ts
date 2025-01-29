import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { appModules } from "./app.module";

/**
 * Swagger General Config
 */
function swaggerConfig(url: string) {
  return new DocumentBuilder()
    .addServer(url, "Local Development Server")
    .addServer(process.env["PRODUCTION_API"]!, "Production Server")

    .addBearerAuth(
      {
        type: "http",
        in: "header",
        description: "##### Auth token in header of this form",
        scheme: "bearer",
      },
      "Authorization",
    );
}

export default async function applicationSwaggerConfig(
  app: NestExpressApplication,
) {
  // const url = await app.getUrl();
  const url = "http://192.168.1.102:3000";

  /**
   * Swagger for APIs
   */
  const apiConfig = swaggerConfig(url)
    .setTitle("IAM APIs")
    .setDescription("Sabahna - The APIs for Identity and Access Management")
    .setVersion("1.0")
    .setExternalDoc("Export to Postman Collection", `${url}/swagger/api-json`)
    .build();
  const apiDocument = SwaggerModule.createDocument(app, apiConfig, {
    include: appModules,
  });
  SwaggerModule.setup("swagger/api", app, apiDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 1,
      defaultModelRendering: "model",
      docExpansion: "none",
    },
  });
}
