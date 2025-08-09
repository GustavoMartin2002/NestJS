import { INestApplication, ValidationPipe } from "@nestjs/common"
import { ParseIntIdPipe } from "src/common/pipes/parse-int-id.pipe";

export default (app: INestApplication)=> {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //  remove keys that are not in dto
      forbidNonWhitelisted: true, // displays error when key does not exist
      transform: false, // tries to transform parameter types and dtos
    }),
    new ParseIntIdPipe(),
  );
  return app;
}