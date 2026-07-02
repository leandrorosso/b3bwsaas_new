"use server"

import { User } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";

type GetAllUsersResult = {
    data: User[];
    error: unknown | null;
};

export async function getAllUsers(): Promise<GetAllUsersResult> {
    try {
        const users = await prisma.user.findMany({
        });

        return { data: users, error: null } ;
    } catch (error) {
        console.error("Error fetching users:", error);
        return  { data: [], error } ;
    }
}