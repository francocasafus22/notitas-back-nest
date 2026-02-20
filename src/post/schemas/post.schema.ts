import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import slugify from "slugify";

export type PostDocument = HydratedDocument<Post>;

@Schema({timestamps: true})
export class Post {

    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String})
    slug: string;

    @Prop({type: String, required: true})
    body: string;

    @Prop({type: String, required: true})
    description: string;

    @Prop({type: String, required: true})
    authorName: string;

    @Prop({type: String, default: null})
    authorAvatar: string;

    @Prop({type: [String], required: true})
    tags: string[];

    @Prop({type: [String]})
    images: string[];

    @Prop({type: String, required: true, enum: ['draft', 'published', 'archived'], default: "published"})
    status: string;

    @Prop({type: Types.ObjectId, required: true, ref: "User"})
    author: Types.ObjectId;

    @Prop({
        type: [{type: Types.ObjectId, ref: "User"}],
        default: []
    })
    likes: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({slug: 1}, {unique: true});

// Pre save hook to generate slug from title
PostSchema.pre("save", async function() {
    if(this.isModified("title") || !this.slug){
        const baseSlug = slugify(this.title, {lower: true, strict: true});
        let slug = baseSlug;
        let counter = 1;

        const PostModel = this.constructor as any;
        while(await PostModel.findOne({slug})){
            slug = `${baseSlug}-${counter++}`;
        }
        this.slug = slug;
    }
})