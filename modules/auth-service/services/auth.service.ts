import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { User } from "../types/auth.types";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const createUser = async (data: User) => {
    const { email, firstName, lastName, passwordHash, phone, avatarUrl, role } = data;

    const findExistUser = await prisma.candidate.findUnique({
        where: { email }
    })
    if (findExistUser) {
        throw new Error("User alredy exist,select unique email address!")
    }
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const result = await prisma.candidate.create({
        data: {
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            phone,
            avatarUrl,
            role: role || UserRole.CANDIDATE,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl:true,
            role: true,
            createdAt: true,
        }
    })
    return result;
}

export const signinUser = async (email: string, passwordHash: string) => {
    const findUser = await prisma.candidate.findUnique({
        where: { email }
    })
    if (!findUser) {
        throw new Error("User don't have value with this email address!")
    }
    const checkMatch = await bcrypt.compare(passwordHash, findUser.passwordHash)
    if (!checkMatch) {
        throw new Error("Invalid password!")
    }
    const token = jwt.sign(
        {
            id: findUser.id,
            role: findUser.role,
        }, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    })
    return { findUser, token }
}

export const viewProfile = async (userId: string) => {
    const findUser = await prisma.candidate.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
        }
    })
    if(!findUser){
        throw new Error("User don't have value with this email address!")
    }
    return findUser
}