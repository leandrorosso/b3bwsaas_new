"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { addUserScales } from "@/app/dashboard/settings/scale/_actions/create_users";
import { deleteUserScale } from "@/app/dashboard/settings/scale/_actions/delete_users";

import type { Scale } from "@/components/dashboard/scales/scales-table";
import { ScalesTable } from "./scales-table";

export interface ScalesProps {
	scales: Scale[];
	userScales: Scale[];
}

export function Scales({ scales, userScales }: ScalesProps): React.JSX.Element {
	const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
	const router = useRouter();
	const { user, isLoading } = useCurrentUser();

	const handleChange = (event: SelectChangeEvent<string[]>) => {
		const value = event.target.value;
		setSelectedValues(typeof value === "string" ? value.split(",") : value);
	};

	const handleAddScale = async () => {
		if (!user?.id) return;

		const result = await addUserScales({
			userId: user.id,
			scaleIds: selectedValues,
		});

		if (result.success) {
			router.refresh();
			console.log("Escalas gravadas com sucesso");
		} else {
			console.error(result.error);
		}
	};

	const handleDeleteScale = async (scale: Scale) => {
		if (!user?.id) return;

		const result = await deleteUserScale({
			userId: user.id,
			scaleId: scale.id,
		});

		if (!result.success) {
			console.error(result.error);
			return;
		}

		router.refresh();
	};

	if (isLoading) {
		return <></>; // ou um skeleton, se preferir
	}

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<UsersIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				subheader="User scales."
				title="Add scales"
			/>

			<CardContent>
				<Stack spacing={2}>
					<FormControl fullWidth>
						<InputLabel id="scales-label">Select the Scales</InputLabel>

						<Select
							labelId="scales-label"
							id="scales-select"
							multiple
							value={selectedValues}
							onChange={handleChange}
							input={<OutlinedInput label="Select the Scales" />}
							renderValue={(selected) =>
								scales
									.filter((scale) => selected.includes(scale.id))
									.map((scale) => scale.name)
									.join(", ")
							}
						>
							{scales
								.filter((scale) => !scale.inactive && !scale.isdeleted)
								.map((scale) => (
									<MenuItem key={scale.id} value={scale.id}>
										{scale.name}
									</MenuItem>
								))}
						</Select>
					</FormControl>

					<div>
						<Button variant="contained" onClick={handleAddScale}>
							Add Scale
						</Button>
					</div>
				</Stack>
			</CardContent>

			<Divider />

			<Box sx={{ overflowX: "auto" }}>
				<ScalesTable rows={userScales} onDeleteScale={handleDeleteScale} />
			</Box>
		</Card>
	);
}