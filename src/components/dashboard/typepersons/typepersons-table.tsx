"use client";

import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Minus as MinusIcon } from "@phosphor-icons/react/dist/ssr/Minus";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";
import type { ColumnDef } from "@/components/core/data-table";

import { useTypepersonsSelection } from "./typepersons-selection-context";

export interface Typeperson {
	id: string;
	name: string;
	inactive: boolean;
	isdeleted: boolean;
	created_at: Date | null;
	updated_at: Date | null;
}

const columns = [
	{
		formatter: (row): React.JSX.Element => (
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<div>
					<Link
						color="inherit"
						component={RouterLink}
						href={paths.dashboard.typepersons.details(row.id)}
						sx={{ whiteSpace: "nowrap" }}
						variant="subtitle2"
					>
						{row.name}
					</Link>
				</div>
			</Stack>
		),
		name: "Name",
		width: "450px",
	},
	{
		formatter(row) {
			return dayjs(row.created_at).format("MMM D, YYYY h:mm A");
		},
		name: "Created at",
		width: "150px",
	},
	{
		formatter(row) {
			return dayjs(row.updated_at).format("MMM D, YYYY h:mm A");
		},
		name: "Updated at",
		width: "150px",
	},	
	{
	formatter: (row): React.JSX.Element => {
		const mapping = {
			true: {
				label: "Inactive",
				value: "Inactive",
				icon: <MinusIcon color="var(--mui-palette-error-main)" />,
			},
			false: {
				label: "Active",
				value: "Active",
				icon: (
					<CheckCircleIcon
						color="var(--mui-palette-success-main)"
						weight="fill"
					/>
				),
			},
		} as const;

		const { label, icon } = mapping[String(row.inactive) as keyof typeof mapping];

		return <Chip icon={icon} label={label} size="small" variant="outlined" />;
	},
	name: "Status",
	width: "100px",
	},
	{
		formatter: (row): React.JSX.Element => (
			<IconButton component={RouterLink} href={paths.dashboard.typepersons.details(row.id)}>
				<PencilSimpleIcon />
			</IconButton>
		),
		name: "Actions",
		hideName: true,
		width: "100px",
		align: "right",
	},
] satisfies ColumnDef<Typeperson>[];

export interface TypePersonsTableProps {
	rows: Typeperson[];
}

export function TypePersonsTable({ rows }: TypePersonsTableProps): React.JSX.Element {
	const { deselectAll, deselectOne, selectAll, selectOne, selected } = useTypepersonsSelection();

	return (
		<React.Fragment>
			<DataTable<Typeperson>
				columns={columns}
				onDeselectAll={deselectAll}
				onDeselectOne={(_, row) => {
					deselectOne(row.id);
				}}
				onSelectAll={selectAll}
				onSelectOne={(_, row) => {
					selectOne(row.id);
				}}
				rows={rows}
				selectable
				selected={selected}
			/>
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No type persons found
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
