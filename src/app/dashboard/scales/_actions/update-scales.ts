"use server"

import prisma from "@/lib/prisma";

export async function updatedScale( { id,  name }: { id: string, name: string }) {

    try {
        const Scales = await prisma.scale.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            }
        });

        return { data: Scales, error: null } ;
    } catch (error) {
        console.error("Error updating scale:", error);
        return  { data: [], error } ;
    }
}

export async function activeScale( { id }: { id: string }) {

    try {

        const existingScale = await prisma.scale.findUnique({
            where: { id: id },
        });

        const isNewInactive = existingScale?.inactive ===  true ? false : true;

        if (!existingScale) {
            return { data: null, error: "Scale not found" };
        }

        const Scales = await prisma.scale.update({
            where: {
                id: id,
            },
            data: {
                inactive: isNewInactive,
            }
        });

        return { data: Scales, error: null } ;
    } catch (error) {
        console.error("Error updating scale:", error);
        return  { data: [], error } ;
    }
}

export async function deleteScale( { id }: { id: string }) {

    try {

        const existingScale = await prisma.scale.findUnique({
            where: { id: id },
        });

        if (!existingScale) {
            return { data: null, error: "Scale not found" };
        }

        const Scales = await prisma.scale.update({
            where: {
                id: id,
            },
            data: {
                isdeleted: true,
            }
        });

        return { data: Scales, error: null } ;
    } catch (error) {
        console.error("Error deleting scale:", error);
        return  { data: [], error } ;
    }
}