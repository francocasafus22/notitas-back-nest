import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {

    _id: Types.ObjectId;

    @Prop({type: String, required: true})
    firstName: string;

    @Prop({type: String, required: true})
    lastName: string;

    @Prop({type: String, required: true})
    username: string;

    @Prop({type: String, required: true})
    password: string;

    @Prop({type: String, required: true})
    email: string;

    @Prop({type: String})
    image: string;

    @Prop({type: String})
    banner: string;

}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });

