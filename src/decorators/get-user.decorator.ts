import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { PayloadDto } from "src/auth/dto/payload-auth.dto";

export const GetUser = createParamDecorator(
    (data: keyof PayloadDto, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user as PayloadDto
        return data ? user[data] : user
    }
)