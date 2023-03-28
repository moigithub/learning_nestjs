import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { CurrentUserInterceptor } from '../users/interceptors/current-user.interceptor';
// import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [
    ReportsService,
    // UsersService,
    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
