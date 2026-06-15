"use server"

import prisma from "@/lib/prisma";

export async function updatedTypePerson( { id,  name }: { id: string, name: string }) {

    try {
        const TypePersons = await prisma.typeperson.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            }
        });

        return { data: TypePersons, error: null } ;
    } catch (error) {
        console.error("Error updating type person:", error);
        return  { data: [], error } ;
    }
}

export async function activeTypePerson( { id }: { id: string }) {

    try {

        const existingTypePerson = await prisma.typeperson.findUnique({
            where: { id: id },
        });

        const isNewInactive = existingTypePerson?.inactive ===  true ? false : true;

        if (!existingTypePerson) {
            return { data: null, error: "Typeperson not found" };
        }

        const TypePersons = await prisma.typeperson.update({
            where: {
                id: id,
            },
            data: {
                inactive: isNewInactive,
            }
        });

        return { data: TypePersons, error: null } ;
    } catch (error) {
        console.error("Error updating type person:", error);
        return  { data: [], error } ;
    }
}

export async function deleteTypePerson( { id }: { id: string }) {

    try {

        const existingTypePerson = await prisma.typeperson.findUnique({
            where: { id: id },
        });

        if (!existingTypePerson) {
            return { data: null, error: "Typeperson not found" };
        }

        const TypePersons = await prisma.typeperson.update({
            where: {
                id: id,
            },
            data: {
                isdeleted: true,
            }
        });

        return { data: TypePersons, error: null } ;
    } catch (error) {
        console.error("Error deleting type person:", error);
        return  { data: [], error } ;
    }
}