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
import { UsersFilters } from "@/components/dashboard/users/users-filters";
import type { Filters } from "@/components/dashboard/users/users-filters";
import { UsersPagination } from "@/components/dashboard/users/users-pagination";
import { UsersSelectionProvider } from "@/components/dashboard/users/users-selection-context";
import { UsersTable } from "@/components/dashboard/users/users-table";
import { User } from "@/generated/prisma/browser";
import { getAllUsers } from "./_data-access/get-all-users";

export const metadata = { title: `List | Users | Dashboard | ${appConfig.name}` } satisfies Metadata;

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

	const { data: users } = await getAllUsers();

	const sortedUsers = applySort(users, sortDir);
	const filteredUsers = applyFilters(sortedUsers, { status });

	const paginatedUsers = filteredUsers.slice(
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
						<Typography variant="h4">Users</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button component={RouterLink} href={paths.dashboard.users.create} startIcon={<PlusIcon />} variant="contained">
							Add
						</Button>
					</Box>
				</Stack>
				<UsersSelectionProvider users={paginatedUsers}>
					<Card>
						<UsersFilters filters={{ status }} sortDir={sortDir} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<UsersTable rows={paginatedUsers} />
						</Box>
						<Divider />
						<UsersPagination 
							count={filteredUsers.length} 
							page={page}
							rowsPerPage={rowsPerPage}
					 	/>
					</Card>
				</UsersSelectionProvider>
			</Stack>
		</Box>
	);
}

// Sorting and filtering has to be done on the server.

function applySort(row: User[], sortDir: "asc" | "desc" | undefined): User[] {
	return row.sort((a, b) => {
		if (sortDir === "asc") {
			return a.created_at!.getTime() - b.created_at!.getTime();
		}

		return b.created_at!.getTime() - a.created_at!.getTime();
	});
}

function applyFilters(row: User[], { status }: Filters): User[] {

	return row.filter((item) => {
		if (status !== undefined && item.inactive !== (status === "Inactive" ? true : false)) {
			return false;
		}

		return true;
	});
}
