import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProgramManagementModule } from './features/program-management/program-management.module';
import { AcademicYearsModule } from './features/academic-years/academic-years.module';
import { ProgramOutcomesModule } from './features/program-outcomes/program-outcomes.module';
import { SyllabusModule } from './features/syllabus/syllabus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: configService.get('DB_SYNC') === 'true',
        autoLoadEntities: true,
        migrationsRun: true, // Auto-run migrations
        ssl: {
          rejectUnauthorized: false, // For self-signed certificates, set to false
        },
        connectTimeout: 60000, // Increase connection timeout if needed
      }),
    }),
    AuthModule,
    ProgramManagementModule,
    AcademicYearsModule,
    ProgramOutcomesModule,
    SyllabusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
