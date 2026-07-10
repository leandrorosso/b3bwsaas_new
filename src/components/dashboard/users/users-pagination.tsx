"use client";

import type * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function noop(): void {
	// No operation
}

interface UsersPaginationProps {
	count: number;
	page: number;
	rowsPerPage: number;	
}

export function UsersPagination({ count, page, rowsPerPage }: UsersPaginationProps): React.JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handlePageChange = (
		_event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	): void => {
		const params = new URLSearchParams(searchParams.toString());

		params.set("page", String(newPage));

		router.push(`${pathname}?${params.toString()}`);
	};

	const handleRowsPerPageChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const params = new URLSearchParams(searchParams.toString());

		params.set("rowsPerPage", event.target.value);

		// Volta para a primeira página ao alterar o tamanho da página
		params.set("page", "0");

		router.push(`${pathname}?${params.toString()}`);
	};


	return (
		<TablePagination
			component="div"
			count={count}
			page={page}
			rowsPerPage={rowsPerPage}
			rowsPerPageOptions={[5, 10, 25]}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
		/>
	);
}
