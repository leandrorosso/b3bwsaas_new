import type * as React from "react";
import type { Metadata } from "next";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { paths } from "@/paths";

import { appConfig } from "@/config/app";
import { TypepersonsFilters } from "@/components/dashboard/typeperson/typepersons-filters";
import type { Filters } from "@/components/dashboard/typeperson/typepersons-filters";
import { TypePersonsPagination } from "@/components/dashboard/typeperson/typepersons-pagination";
import { TypepersonsSelectionProvider } from "@/components/dashboard/typeperson/typepersons-selection-context";
import { TypePersonsTable } from "@/components/dashboard/typeperson/typepersons-table";
import type { Typeperson } from "@/components/dashboard/typeperson/typepersons-table";
import { getAllTypePersons } from "./_data-access/get-all-typepersons";

export const metadata = { title: `List | Type Persons | Dashboard | ${appConfig.name}` } satisfies Metadata;

const { data: typepersons } = await getAllTypePersons();

interface PageProps {
	searchParams: Promise<{ sortDir?: "asc" | "desc"; status?: string }>;
}

export default async function Page({ searchParams }: PageProps): Promise<React.JSX.Element> {
	const { sortDir, status } = await searchParams;

	const sortedTypepersons = applySort(typepersons, sortDir);
	const filteredTypepersons = applyFilters(sortedTypepersons, { status });

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Type Persons</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button component={RouterLink} href={paths.dashboard.typepersons.create} startIcon={<PlusIcon />} variant="contained">
							Add
						</Button>
					</Box>
				</Stack>
				<TypepersonsSelectionProvider typepersons={filteredTypepersons}>
					<Card>
						<TypepersonsFilters filters={{ status }} sortDir={sortDir} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<TypePersonsTable rows={filteredTypepersons} />
						</Box>
						<Divider />
						<TypePersonsPagination count={filteredTypepersons.length} page={0} />
					</Card>
				</TypepersonsSelectionProvider>
			</Stack>
		</Box>
	);
}

// Sorting and filtering has to be done on the server.

function applySort(row: Typeperson[], sortDir: "asc" | "desc" | undefined): Typeperson[] {
	return row.sort((a, b) => {
		if (sortDir === "asc") {
			return a.created_at!.getTime() - b.created_at!.getTime();
		}

		return b.created_at!.getTime() - a.created_at!.getTime();
	});
}

function applyFilters(row: Typeperson[], { status }: Filters): Typeperson[] {

	return row.filter((item) => {
		if (status !== undefined && item.inactive !== (status === "Inactive" ? true : false)) {
			return false;
		}

		return true;
	});
}
