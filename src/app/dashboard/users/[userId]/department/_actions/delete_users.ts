"use server"

import prisma from "@/lib/prisma";

interface DeleteUserScaleProps {
    userId: string;
    scaleId: string;
}

export async function deleteUserScale({
    userId,
    scaleId,
}: DeleteUserScaleProps) {
    try {
        await prisma.userscale.updateMany({
            where: {
                user_id: userId,
                scale_id:scaleId,
                isdeleted: false,
            },
            data: {
                isdeleted: true,
            },
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error,
        };
    }
}