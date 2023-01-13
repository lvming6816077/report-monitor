import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarningService } from './warning.service';
import { UserModule } from 'src/user/user.module';
import { ReportModule } from 'src/report/report.module';
import { Warning, WarningSchema } from './schemas/warning.schema';
import { WarningController } from './warning.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
    imports: [
        forwardRef(() => ReportModule),
        forwardRef(() => UserModule),
        MongooseModule.forFeature([
            { name: Warning.name, schema: WarningSchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [WarningController],
    providers: [WarningService],

    exports: [WarningService],
})
export class WarningModule {}
