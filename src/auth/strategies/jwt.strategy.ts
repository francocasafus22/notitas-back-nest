import { Injectable } from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt"
import { envs } from "src/config/envs";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { PayloadDto } from "../dto/payload-auth.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

