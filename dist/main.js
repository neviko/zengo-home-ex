"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require('dotenv').config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(process.env.PORT || 3000);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        dismissDefaultMessages: true,
        forbidUnknownValues: true,
        exceptionFactory: (errors) => new common_1.UnprocessableEntityException(errors),
    }));
}
bootstrap();
//# sourceMappingURL=main.js.map