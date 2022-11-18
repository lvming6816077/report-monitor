import { IsInt, IsString,IsEmpty,IsNotEmpty,  isString, IsOptional, IsArray, IsPhoneNumber, IsEmail } from 'class-validator';


import { Optional } from '@nestjs/common';
export class CreateProjectDto  {

    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    type:string

    @IsString()
    @IsOptional()
    desc:string


}
