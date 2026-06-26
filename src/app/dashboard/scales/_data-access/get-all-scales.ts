"use server"

import prisma from "@/lib/prisma";
import type { Scale } from "@/components/dashboard/scales/scales-table";

type GetAllScalesResult = {
    data: Scale[];
    error: unknown | null;
};

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

export async function getScalesData(userId: string) {
  const [allScales, userScales] = await Promise.all([
    prisma.scale.findMany({
      where: {
        isdeleted: false,
        userscales: {
          none: {
            user_id: userId,
            isdeleted: false,
          },
        },
      },
    }),

    prisma.scale.findMany({
      where: {
        isdeleted: false,
        userscales: {
          some: {
            user_id: userId,
            isdeleted: false,
          },
        },
      },
    }),
  ]);

  return {
    allScales,
    userScales,
  };
}