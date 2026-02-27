import { PayloadDto } from "src/auth/dto/payload-auth.dto";
import { PostDocument } from "src/post/schemas/post.schema";

declare global {
    namespace Express{
        interface User extends PayloadDto{}
        interface Request{
            user?: PayloadDto;
            resource? 
        }
    }
}