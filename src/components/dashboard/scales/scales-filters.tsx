"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { ArrowDown as ArrowDropDownIcon } from "@phosphor-icons/react/dist/ssr/ArrowDown"; 

import { paths } from "@/paths";
import { Option } from "@/components/core/option";

import { useScalesSelection } from "./scales-selection-context";
import { deleteScale, activeScale } from "@/app/dashboard/scales/_actions/update-scales";

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

export interface ScalesFiltersProps {
	filters?: Filters;
	sortDir?: SortDir;
}

export function ScalesFilters({ filters = {}, sortDir = "desc" }: ScalesFiltersProps): React.JSX.Element {
	const options = ["Delete", "(In)Activate"];

	const [open, setOpen] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const anchorRef = React.useRef<HTMLDivElement>(null);

	const { status } = filters;

	const router = useRouter();

	const selection = useScalesSelection();

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
				ids.map((id) => deleteScale({ id }))
			);

			router.refresh();
		} catch (error) {
			console.error("Erro ao excluir registros:", error);
		}
	}, [selection.selected, router]);


	const handleActive = React.useCallback(
	async (inactive: boolean) => {
		try {
			const ids = Array.from(selection.selected);

			await Promise.all(
				ids.map((id) =>
					activeScale({
						id,
					})
				)
			);

			router.refresh();
		} catch (error) {
			console.error("Erro ao atualizar registros:", error);
		}
	},
	[selection.selected, router]
	);

	const updateSearchParams = React.useCallback(
		(newFilters: Filters, newSortDir: SortDir): void => {
			const searchParams = new URLSearchParams();

			if (newSortDir === "asc") {
				searchParams.set("sortDir", newSortDir);
			}

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}

			router.push(`${paths.dashboard.scales.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleAction = React.useCallback(async () => {
		switch (selectedIndex) {
			case 0:
				await handleDelete();
				break;

			case 1:
				await handleActive(false); // Active
				break;

			case 2:
				await handleActive(true); // Inactive
				break;
		}
	}, [selectedIndex, handleDelete, handleActive]);

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

	const handleClick = () => {
		handleAction();
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLLIElement>,
		index: number
	) => {
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleClose = (event: Event) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}

		setOpen(false);
};

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
						<div ref={anchorRef}>
							<ButtonGroup variant="contained">
								<Button
									color={
										selectedIndex === 0
											? "error"
											: selectedIndex === 1
											? "success"
											: "warning"
									}
									onClick={handleClick}
								>
									{options[selectedIndex]}
								</Button>

								<Button
									size="small"
									onClick={handleToggle}
									color="error"
								>
									<ArrowDropDownIcon />
								</Button>
							</ButtonGroup>

							<Popper
								open={open}
								anchorEl={anchorRef.current}
								transition
								disablePortal
							>
								{({ TransitionProps }) => (
									<Grow {...TransitionProps}>
										<Paper>
											<ClickAwayListener onClickAway={handleClose}>
												<MenuList>
													{options.map((option, index) => (
														<MenuItem
															key={option}
															selected={index === selectedIndex}
															onClick={(event) =>
																handleMenuItemClick(event, index)
															}
														>
															{option}
														</MenuItem>
													))}
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</div>
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
