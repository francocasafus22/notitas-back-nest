import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Connection, connection } from 'mongoose';
import { envs } from './config/envs';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRootAsync({useFactory: () => ({
    uri: envs.mongo_uri,
    onConnectionCreate: (connection: Connection) => {
      connection.on("connected", () => console.log("DATABASE CONNECTED SUCCESSFULLY!"))
      return connection
    }
    
  }) }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
