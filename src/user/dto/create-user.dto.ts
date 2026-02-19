import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
    @IsString()
    username: string
    @IsEmail()
    email: string
    @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
    password: string
    @IsString()
    firstName: string
    @IsString()
    lastName: string
    @IsString()
    description: string
}
