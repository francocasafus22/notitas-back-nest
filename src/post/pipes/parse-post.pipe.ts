import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post, PostDocument } from "../schemas/post.schema";

@Injectable()
export class ParsePostPipe implements PipeTransform{
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ){}

    async transform(value: string, metadata: ArgumentMetadata) : Promise<PostDocument>{
        if(!Types.ObjectId.isValid(value)){
            throw new NotFoundException("Invalid post id");
        }
        const post = await this.postModel.findById(value).exec();
        if(!post) throw new NotFoundException("Post not found");
        return post;
    }
}