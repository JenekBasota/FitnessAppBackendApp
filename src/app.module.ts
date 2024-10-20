import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UsersService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0180',
      database: 'FitnessAppDb',
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User]), // Регистрация репозитория для сущности User
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
