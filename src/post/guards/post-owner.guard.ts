import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { Post, PostDocument } from "../schemas/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PayloadDto } from "src/auth/dto/payload-auth.dto";

@Injectable()
export class PostOwnerGuard implements CanActivate{
    
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{

        const request = context.switchToHttp().getRequest<Request>()
        const user = request.user;
        const {id} = request.params;

        const post: PostDocument | null = await this.postModel.findById(id).exec();

        if(!post) throw new NotFoundException("Post not found");

        if(!post.author.equals(user?.userId)){
            throw new ForbiddenException("You are not allowed to update this post");
        }

        request.post = post
        return true
    }
}