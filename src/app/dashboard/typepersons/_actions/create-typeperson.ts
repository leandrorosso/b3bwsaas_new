"use server"

import prisma from "@/lib/prisma";

export async function createdTypePersons({ name }: { name: string }) {

    const existingTypePerson = await prisma.typeperson.findFirst({
        where: {
            name: name,
            isdeleted: false,
        },
    });

    if (existingTypePerson) {
        return { data: existingTypePerson, error: null } ;
    }

    try {
        const NewTypePersons = await prisma.typeperson.create({
            data: {
                name: name,
                inactive: false,
                isdeleted: false,
            }
        });

        return { data: NewTypePersons, error: null } ;
    } catch (error) {
        console.error("Error creating type persons:", error);
        return  { data: [], error } ;
    }
}