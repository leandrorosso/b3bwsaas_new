"use server"

import prisma from "@/lib/prisma";

export async function createdScales({ name }: { name: string }) {

    const existingScale = await prisma.scale.findFirst({
        where: {
            name: name,
            isdeleted: false,
        },
    });

    if (existingScale) {
        return { data: existingScale, error: null } ;
    }

    try {
        const NewScales = await prisma.scale.create({
            data: {
                name: name,
                inactive: false,
                isdeleted: false,
            }
        });

        return { data: NewScales, error: null } ;
    } catch (error) {
        console.error("Error creating scales:", error);
        return  { data: [], error } ;
    }
}