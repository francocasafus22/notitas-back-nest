import { IsEnum, isMongoId, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    body: string;
    
    @IsString()
    description: string;
    
    @IsString({ each: true })
    tags: string[];

    @IsString({ each: true })
    @IsOptional()
    images: string[];

    @IsEnum(['draft', 'published', 'archived'])
    @IsOptional()
    status: string;
}
