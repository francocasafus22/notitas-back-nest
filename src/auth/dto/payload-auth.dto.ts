import { Types } from "mongoose"

export class PayloadDto {    
  userId: Types.ObjectId
  username: string
}
