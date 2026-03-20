import { Injectable, UnauthorizedException } from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt"
import { envs } from "src/config/envs";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { PayloadDto } from "../dto/payload-auth.dto";
import type { Request } from "express";
import { UserService } from "src/user/user.service";
import { NotFoundError } from "rxjs";
import { UserDocument } from "src/user/schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private userService: UserService
    ){        
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.NOTITAS_TOKEN
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: envs.jwt_secret
        })
    }

    async validate(payload: any): Promise<PayloadDto>{
        const userExist: UserDocument | null = await this.userService.findOne({id: payload.sub});
        if(!userExist) throw new UnauthorizedException("User no longer exists");
        return{
            userId: userExist._id,
            username: userExist.username
        }
    }
}

