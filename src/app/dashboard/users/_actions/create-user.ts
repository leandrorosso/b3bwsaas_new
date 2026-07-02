"use server"

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export interface UserParams {
	firstName: string;
	lastName: string;
	email: string;
	emailVerified: string;
	address?: string | null;
	phone?: string | null;
	password: string;
}

 export async function createdUsers(_: UserParams) {

    const existingUser = await prisma.user.findFirst({
        where: {
            name: _.email,
            isdeleted: false,
        },
    });

    if (existingUser) {
        return { data: existingUser, error: null } ;
    }

    const passwordHash = await hash(_.password, 8)
        
    try {
        const NewUsers = await prisma.user.create({
            data: {
			name: `${_.firstName} ${_.lastName}`,
			firstname: _.firstName,
			lastname: _.lastName,	
			email: _.email,
			emailVerified: _.emailVerified,
			address: _.address,
			phone: _.phone,	
			status: true,
			inactive: false,
			password: passwordHash,
            }
        });

        return { data: NewUsers, error: null } ;
    } catch (error) {
        console.error("Error creating users:", error);
        return  { data: [], error } ;
    }
}