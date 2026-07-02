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
import { createdUsers } from "@/app/dashboard/users/_actions/create-user";

const schema = zod.object({
	firstName: zod.string().min(1, { message: "First name is required" }),
	lastName: zod.string().min(1, { message: "Last name is required" }),
	email: zod.string().min(1, { message: "Email is required" }).email(),
	emailVerified: zod.string().min(1, { message: "Email for verification is required" }).email(),
	address: zod.string().optional(),
	phone: zod.string().optional(),
	password: zod.string().min(6, { message: "Password should be at least 6 characters" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { 
	firstName: "", 
	lastName: "", 
	email: "", 
	emailVerified: "", 
	address: "", 
	phone: "", 
	password: "" } satisfies Values;

export function UserCreateForm(): React.JSX.Element {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {
			const response = await createdUsers(values);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("User created");
				router.push(paths.dashboard.users.list);
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
							<Typography variant="h6">User information</Typography>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 6,
										xs: 12,
									}}
								>
						<Controller
							control={control}
							name="firstName"
							render={({ field }) => (
								<FormControl error={Boolean(errors.firstName)}>
									<InputLabel>First name</InputLabel>
									<OutlinedInput {...field} />
									{errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="lastName"
							render={({ field }) => (
								<FormControl error={Boolean(errors.lastName)}>
									<InputLabel>Last name</InputLabel>
									<OutlinedInput {...field} />
									{errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<FormControl error={Boolean(errors.email)}>
									<InputLabel>Email address</InputLabel>
									<OutlinedInput {...field} type="email" />
									{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="emailVerified"
							render={({ field }) => (
								<FormControl error={Boolean(errors.emailVerified)}>
									<InputLabel>Email address for verification</InputLabel>
									<OutlinedInput {...field} type="email" />
									{errors.emailVerified ? <FormHelperText>{errors.emailVerified.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="address"
							render={({ field }) => (
								<FormControl error={Boolean(errors.address)}>
									<InputLabel>Address</InputLabel>
									<OutlinedInput {...field} />
									{errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="phone"
							render={({ field }) => (
								<FormControl error={Boolean(errors.phone)}>
									<InputLabel>Phone</InputLabel>
									<OutlinedInput {...field} />
									{errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>																
						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<FormControl error={Boolean(errors.password)}>
									<InputLabel>Password</InputLabel>
									<OutlinedInput {...field} type="password" />
									{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
								</FormControl>
							)}
						/>
								</Grid>
							</Grid>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button color="secondary" component={RouterLink} href={paths.dashboard.users.list}>
						Cancel
					</Button>
					<Button type="submit" variant="contained">
						Create user
					</Button>
				</CardActions>
			</Card>
		</form>
	);
}
