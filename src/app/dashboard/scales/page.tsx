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
import { ScalesFilters } from "@/components/dashboard/scales/scales-filters";
import type { Filters } from "@/components/dashboard/scales/scales-filters";
import { ScalesPagination } from "@/components/dashboard/scales/scales-pagination";
import { ScalesSelectionProvider } from "@/components/dashboard/scales/scales-selection-context";
import { ScalesTable } from "@/components/dashboard/scales/scales-table";
import type { Scale } from "@/components/dashboard/scales/scales-table";
import { getAllScales } from "./_data-access/get-all-scales";

export const metadata = { title: `List | Scales | Dashboard | ${appConfig.name}` } satisfies Metadata;

interface PageProps {
	searchParams: Promise<{
		sortDir?: "asc" | "desc"; 
		status?: string 
		page?: string;
		rowsPerPage?: string;
	}>;
}

export default async function Page({ searchParams }: PageProps): Promise<React.JSX.Element> {
	const { sortDir, 
			status, 
			page: pageParam,
			rowsPerPage: rowsPerPageParam, 
		} = await searchParams;

	const page = Number(pageParam ?? 0);
	const rowsPerPage = Number(rowsPerPageParam ?? 5);

	const { data: scales } = await getAllScales();

	const sortedScales = applySort(scales, sortDir);
	const filteredScales = applyFilters(sortedScales, { status });

	const paginatedScales = filteredScales.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

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
						<Typography variant="h4">Scales</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button component={RouterLink} href={paths.dashboard.scales.create} startIcon={<PlusIcon />} variant="contained">
							Add
						</Button>
					</Box>
				</Stack>
				<ScalesSelectionProvider scales={paginatedScales}>
					<Card>
						<ScalesFilters filters={{ status }} sortDir={sortDir} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<ScalesTable rows={paginatedScales} />
						</Box>
						<Divider />
						<ScalesPagination 
							count={filteredScales.length} 
							page={page}
							rowsPerPage={rowsPerPage}
					 	/>
					</Card>
				</ScalesSelectionProvider>
			</Stack>
		</Box>
	);
}

// Sorting and filtering has to be done on the server.

function applySort(row: Scale[], sortDir: "asc" | "desc" | undefined): Scale[] {
	return row.sort((a, b) => {
		if (sortDir === "asc") {
			return a.created_at!.getTime() - b.created_at!.getTime();
		}

		return b.created_at!.getTime() - a.created_at!.getTime();
	});
}

function applyFilters(row: Scale[], { status }: Filters): Scale[] {

	return row.filter((item) => {
		if (status !== undefined && item.inactive !== (status === "Inactive" ? true : false)) {
			return false;
		}

		return true;
	});
}
