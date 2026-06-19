"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { paths } from "@/paths";
import { Option } from "@/components/core/option";

import { useTypepersonsSelection } from "./typepersons-selection-context";
import { deleteTypePerson } from "@/app/dashboard/typepersons/_actions/update-typeperson";

// The tabs should be generated using API data.
const tabs = [
	{ label: "All", value: "", count: 5 },
	{ label: "Active", value: "Active", count: 3 },
	{ label: "Inactive", value: "Inactive", count: 1 },
] as const;

export interface Filters {
	status?: string;
}

export type SortDir = "asc" | "desc";

export interface TypepersonsFiltersProps {
	filters?: Filters;
	sortDir?: SortDir;
}

export function TypepersonsFilters({ filters = {}, sortDir = "desc" }: TypepersonsFiltersProps): React.JSX.Element {
	const { status } = filters;

	const router = useRouter();

	const selection = useTypepersonsSelection();

	const handleDelete = React.useCallback(async () => {
		const confirmed = window.confirm(
			`Deseja excluir ${selection.selected.size} registro(s)?`
		);

		if (!confirmed) {
			return;
		}

		try {
			const ids = Array.from(selection.selected);

			await Promise.all(
				ids.map((id) => deleteTypePerson({ id }))
			);

			router.refresh();
		} catch (error) {
			console.error("Erro ao excluir registros:", error);
		}
	}, [selection.selected, router]);

	const updateSearchParams = React.useCallback(
		(newFilters: Filters, newSortDir: SortDir): void => {
			const searchParams = new URLSearchParams();

			if (newSortDir === "asc") {
				searchParams.set("sortDir", newSortDir);
			}

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}

			router.push(`${paths.dashboard.typepersons.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleClearFilters = React.useCallback(() => {
		updateSearchParams({}, sortDir);
	}, [updateSearchParams, sortDir]);

	const handleStatusChange = React.useCallback(
		(_: React.SyntheticEvent, value: string) => {

			updateSearchParams({ ...filters, status: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);


	const handleSortChange = React.useCallback(
		(event: SelectChangeEvent) => {
			updateSearchParams(filters, event.target.value as SortDir);
		},
		[updateSearchParams, filters]
	);

	const hasFilters = status ;

	return (
		<div>
			<Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ""} variant="scrollable">
				{tabs.map((tab) => (
					<Tab
						//icon={<Chip label={tab.count} size="small" variant="soft" />}
						iconPosition="end"
						key={tab.value}
						label={tab.label}
						sx={{ minHeight: "auto" }}
						tabIndex={0}
						value={tab.value}
					/>
				))}
			</Tabs>
			<Divider />
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
					{hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
				</Stack>
				{selection.selectedAny ? (
					<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
						<Typography color="text.secondary" variant="body2">
							{selection.selected.size} selected
						</Typography>
						<Button color="error" 
								variant="contained" 
								onClick={handleDelete}>
							Delete
						</Button>
					</Stack>
				) : null}
				<Select name="sort" onChange={handleSortChange} sx={{ maxWidth: "100%", width: "120px" }} value={sortDir}>
					<Option value="desc">Newest</Option>
					<Option value="asc">Oldest</Option>
				</Select>
			</Stack>
		</div>
	);
}
