import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {

    _id: Types.ObjectId;

    @Prop({type: String, required: true})
    username: string;

    @Prop({type: String, required: true})
    password: string;

    @Prop({type: String, required: true})
    email: string;
}

export const UserSchema = SchemaFactory.createForClass(User)