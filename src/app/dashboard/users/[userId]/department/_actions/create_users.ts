"use server"

import prisma from "@/lib/prisma";

interface AddUserScalesProps {
    userId: string;
    scaleIds: string[];
}

export async function addUserScales({
    userId,
    scaleIds,
}: AddUserScalesProps) {
    try {
        await prisma.userscale.createMany({
            data: scaleIds.map((scaleId) => ({
                user_id: userId,
                scale_id: scaleId,
            })),
            skipDuplicates: true,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
}