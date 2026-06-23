"use server"

import prisma from "@/lib/prisma";

export interface Scale {
    id: string;
    name: string;
    inactive: boolean;
    isdeleted: boolean;
    created_at: Date | null;
    updated_at: Date | null;
}
type GetAllScalesResult = {
    data: Scale[];
    error: unknown | null;
};

export async function getUserScales({ id: userId }: { id: string }): Promise<GetAllScalesResult> {
    try {
        const scales = await prisma.scale.findMany({
            where: {
                isdeleted: false,
                userscales: {
                    none: {
                        user_id: userId,
                        isdeleted: false 
                    }
                }
            }
        });

        return { data: scales, error: null } ;
    } catch (error) {
        console.error("Error fetching scales:", error);
        return  { data: [], error } ;
    }
}

export async function getAllScales(): Promise<GetAllScalesResult> {
    try {
        const scales = await prisma.scale.findMany({
            where: {
                isdeleted: false
            }
        });

        return { data: scales, error: null } ;
    } catch (error) {
        console.error("Error fetching scales:", error);
        return  { data: [], error } ;
    }
}