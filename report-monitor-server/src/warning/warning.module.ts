
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WarningService } from "./warning.service";
import { UserModule } from "src/user/user.module";
import { ReportModule } from "src/report/report.module";
import { Warning, WarningSchema } from "./schemas/warning.schema";
import { WarningController } from "./warning.controller";

@Module({
    imports: [forwardRef(() => ReportModule),UserModule,MongooseModule.forFeature([{ name: Warning.name, schema: WarningSchema }])],
    controllers: [WarningController],
    providers: [WarningService],

    exports: [WarningService],
})
export class WarningModule {}