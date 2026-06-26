"use client";

import type * as React from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";

import { DataTable } from "@/components/core/data-table";
import type { ColumnDef } from "@/components/core/data-table";
import type { Scale } from "@/components/dashboard/scales/scales-table";

export interface ScalesTableProps {
    rows: Scale[];
    onDeleteScale: (scale: Scale) => Promise<void>;
}

const getColumns = (
    onDeleteScale: (scale: Scale) => Promise<void>
): ColumnDef<Scale>[] => [
    {
        formatter: (row): React.JSX.Element => (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="subtitle2">{row.name}</Typography>
            </Stack>
        ),
        name: "Name",
        width: "350px",
    },
    {
        formatter: (row): React.JSX.Element => (
            <IconButton onClick={() => onDeleteScale(row)}>
                <DotsThreeIcon weight="bold" />
            </IconButton>
        ),
        name: "Actions",
        hideName: true,
        width: "100px",
        align: "right",
    },
];

export function ScalesTable({
    rows,
    onDeleteScale,
}: ScalesTableProps): React.JSX.Element {
    return (
        <DataTable<Scale>
            columns={getColumns(onDeleteScale)}
            rows={rows}
        />
    );
}