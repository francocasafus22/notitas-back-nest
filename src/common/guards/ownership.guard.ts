import { CanActivate, ExecutionContext, ForbiddenException, Injectable, mixin, NotFoundException, Type } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { getModelToken, InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PayloadDto } from "src/auth/dto/payload-auth.dto";

export function OwnershipGuard(modelName: string) {
    @Injectable()
    class OwnershipMixin implements CanActivate{
        
        constructor(
            @InjectModel(modelName) public model: Model<any>
        ){}

        async canActivate(context: ExecutionContext): Promise<boolean>{

            const request = context.switchToHttp().getRequest<Request<{ id: string }>>()
            const user = request.user;
            const {id} = request.params;

            if(!Types.ObjectId.isValid(id)){
                throw new NotFoundException("Invalid id");
            }
            
            const resource = await this.model.findById(id).exec();
            
            if(!resource) throw new NotFoundException(`${modelName} not found`);

            if(!resource.author.equals(user?.userId)){
                throw new ForbiddenException(`You are not allowed to update this ${modelName}`);
            }

            request.resource = resource
            return true            
        }
        
    }
    return mixin(OwnershipMixin);
}