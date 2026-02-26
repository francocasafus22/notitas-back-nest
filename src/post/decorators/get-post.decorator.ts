import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPost = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.post;
    },
);