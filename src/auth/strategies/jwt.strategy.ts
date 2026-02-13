import { Injectable } from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt"
import { envs } from "src/config/envs";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { PayloadDto } from "../dto/payload-auth.dto";
import type { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.access_token
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: envs.jwt_secret
        })
    }

    async validate(payload: any): Promise<PayloadDto>{
        
        return{
            userId: payload.sub,
            username: payload.username
        }
    }
}

