"use server"

import { Typeperson } from "@/components/dashboard/typepersons/typepersons-table";
import prisma from "@/lib/prisma";

type GetAllTypePersonsResult = {
    data: Typeperson[];
    error: unknown | null;
};

export async function getAllTypePersons(): Promise<GetAllTypePersonsResult> {
    try {
        const typepersons = await prisma.typeperson.findMany({
            where: {
                isdeleted: false
            }
        });

        return { data: typepersons, error: null } ;
    } catch (error) {
        console.error("Error fetching type persons:", error);
        return  { data: [], error } ;
    }
}