import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Connection, connection } from 'mongoose';
import { envs } from './config/envs';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

const logger = new Logger("Mongo_DB")

@Module({
  imports: [MongooseModule.forRootAsync({useFactory: () => ({
    uri: envs.mongo_uri,
    onConnectionCreate: (connection: Connection) => {
      connection.on("connected", () => logger.log("DATABASE CONNECTED"));
      return connection
    }
    
  }) }), UserModule, AuthModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');  
  }
}
