import { UserRole } from "../../../generated/prisma/enums";

export interface User{
 email:string;
 firstName:string;
 lastName:string;
 passwordHash:string;
 phone:string;
 avatarUrl:string;
 role?:UserRole
}