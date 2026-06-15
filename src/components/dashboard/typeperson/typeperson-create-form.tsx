"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";
import { createdTypePersons } from "@/app/dashboard/typepersons/_actions/create-typeperson";

const schema = zod.object({
	name: zod.string().min(1, "Name is required").max(255),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
	name: "",
} satisfies Values;

export function TypePersonCreateForm(): React.JSX.Element {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (_: Values): Promise<void> => {

			const response = await createdTypePersons({
				name:_.name,
			});

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Type person created");
				router.push(paths.dashboard.typepersons.details(response.data.id));
			} else {
				logger.error(response.error);
				toast.error("Something went wrong!");
			}
		},
		[router]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardContent>
					<Stack divider={<Divider />} spacing={4}>
						<Stack spacing={3}>
							<Typography variant="h6">Type Person information</Typography>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 6,
										xs: 12,
									}}
								>
									<Controller
										control={control}
										name="name"
										render={({ field }) => (
											<FormControl error={Boolean(errors.name)} fullWidth>
												<InputLabel required>Name</InputLabel>
												<OutlinedInput {...field} />
												{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button color="secondary" component={RouterLink} href={paths.dashboard.typepersons.list}>
						Cancel
					</Button>
					<Button type="submit" variant="contained">
						Create type person
					</Button>
				</CardActions>
			</Card>
		</form>
	);
}
