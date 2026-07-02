"use server"

import prisma from "@/lib/prisma";

export async function updatedUser( { id,  name }: { id: string, name: string }) {

    try {
        const Users = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            }
        });

        return { data: Users, error: null } ;
    } catch (error) {
        console.error("Error updating user:", error);
        return  { data: [], error } ;
    }
}

export async function activeUser( { id }: { id: string }) {

    try {

        const existingUser = await prisma.user.findUnique({
            where: { id: id },
        });

        const isNewInactive = existingUser?.inactive ===  true ? false : true;

        if (!existingUser) {
            return { data: null, error: "User not found" };
        }

        const Users = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                inactive: isNewInactive,
            }
        });

        return { data: Users, error: null } ;
    } catch (error) {
        console.error("Error updating user:", error);
        return  { data: [], error } ;
    }
}

export async function deleteUser( { id }: { id: string }) {

    try {

        const existingUser = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!existingUser) {
            return { data: null, error: "User not found" };
        }

        const Users = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                isdeleted: true,
            }
        });

        return { data: Users, error: null } ;
    } catch (error) {
        console.error("Error deleting user:", error);
        return  { data: [], error } ;
    }
}