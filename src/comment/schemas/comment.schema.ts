import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Post } from "../../post/schemas/post.schema";
import { User } from "../../user/schemas/user.schema";

export type CommentDocument = HydratedDocument<Comment>;
@Schema({timestamps: true})
export class Comment {

    @Prop({type: String, required: true})
    body: string;

    @Prop({type: Types.ObjectId, required: true, ref: "User"})
    author: Types.ObjectId | User;

    @Prop({type: String, required: true})
    authorName: string;

    @Prop({type: String, default: null})
    authorAvatar: string;

    @Prop({type: Types.ObjectId, required: true, ref: "Post"})
    post: Types.ObjectId | Post; 

    @Prop({
        type: [{type: Types.ObjectId, ref: "User"}],
        default: []
    })
    likes: Types.ObjectId[];
}   

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({post: 1});                                     
