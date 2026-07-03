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
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";
import { createdUsers } from "@/app/dashboard/users/_actions/create-user";

import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Minus as MinusIcon } from "@phosphor-icons/react/dist/ssr/Minus";

import { phoneMask} from "@/lib/formats/phone";

const passwordSchema = zod
	.string()
	.min(8, { message: "Password must contain at least 8 characters" })
	.regex(/[A-Z]/, {
	message: "Password must contain at least one uppercase letter",
	})
	.regex(/[a-z]/, {
	message: "Password must contain at least one lowercase letter",
	})
	.regex(/[0-9]/, {
	message: "Password must contain at least one number",
	})
	.regex(/[^A-Za-z0-9]/, {
	message: "Password must contain at least one special character",
});

const schema = zod
  .object({
    firstName: zod.string().min(1, { message: "First name is required" }),
    lastName: zod.string().min(1, { message: "Last name is required" }),
    email: zod.string().min(1, { message: "Email is required" }).email(),
    emailVerified: zod
		.string()
		.min(1, { message: "Email for verification is required" })
		.email(),
    address: zod.string().optional(),
    phone: zod
		.string()
		.regex(
			/^\(\d{2}\)\s\d{5}-\d{4}$/,
			"Invalid phone number format. Expected format: (XX) XXXXX-XXXX"
	)
	.optional()
	.or(zod.literal("")),

    password: passwordSchema,

    confirmPassword: zod
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
type Values = zod.infer<typeof schema>;

const defaultValues = { 
	firstName: "", 
	lastName: "", 
	email: "", 
	emailVerified: "", 
	address: "", 
	phone: "", 
	password: "", 
	confirmPassword: "" } satisfies Values;

	interface PasswordRuleProps {
  valid: boolean;
  text: string;
}

function PasswordRule({
  valid,
  text,
	}: PasswordRuleProps): React.JSX.Element {
	return (
		<ListItem dense sx={{ py: 0 }}>
		<ListItemIcon sx={{ minWidth: 30 }}>
			{valid ? (
			<CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" fontSize="small" size={16} />
			) : (
			<MinusIcon color="var(--mui-palette-error-main)" weight="fill" fontSize="small" size={16} />
			)}
		</ListItemIcon>

		<ListItemText
			primary={text}
			primaryTypographyProps={{
			fontSize: 13,
			}}
		/>
		</ListItem>
  );
}
export function UserCreateForm(): React.JSX.Element {
	const router = useRouter();
	const [showPassword, setShowPassword] = React.useState<boolean>();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	const password = watch("password") || "";

	const passwordValidation = React.useMemo(
		() => ({
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /\d/.test(password),
			special: /[^A-Za-z0-9]/.test(password),
		}),
		[password]
	);

	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {

			const { confirmPassword, ...userData } = values;

			const response = await createdUsers(userData);

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
					<Stack divider={<Divider />} spacing={3}>
						<Stack spacing={2}>
							<Typography variant="h6">User information</Typography>

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

									<OutlinedInput
										{...field}
										value={field.value ?? ""}
										onChange={(e) => field.onChange(phoneMask(e.target.value))}
									/>

									{errors.phone ? (
										<FormHelperText>{errors.phone.message}</FormHelperText>
									) : null}
									</FormControl>
								)}
							/>																						
							<Controller
								control={control}
								name="password"
								render={({ field }) => (
									<FormControl error={Boolean(errors.password)}>
										<InputLabel>Password</InputLabel>
										<OutlinedInput
											{...field}
											endAdornment={
												showPassword ? (
													<EyeIcon
														cursor="pointer"
														fontSize="var(--icon-fontSize-md)"
														onClick={(): void => {
															setShowPassword(false);
														}}
													/>
												) : (
													<EyeSlashIcon
														cursor="pointer"
														fontSize="var(--icon-fontSize-md)"
														onClick={(): void => {
															setShowPassword(true);
														}}
													/>
												)
											}
											type={showPassword ? "text" : "password"}
										/>
										{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}

										<Paper
											variant="outlined"
											sx={{
											mt: 2,
											p: 1,
											bgcolor: "background.default",
											}}
										>
											<Typography
											variant="subtitle2"
											sx={{ mb: 1 }}
											>
											Password requirements
											</Typography>

											<List dense sx={{ py: 0 }}>
											<PasswordRule
												valid={passwordValidation.length}
												text="At least 8 characters"
											/>

											<PasswordRule
												valid={passwordValidation.uppercase}
												text="One uppercase letter"
											/>

											<PasswordRule
												valid={passwordValidation.lowercase}
												text="One lowercase letter"
											/>

											<PasswordRule
												valid={passwordValidation.number}
												text="One number"
											/>

											<PasswordRule
												valid={passwordValidation.special}
												text="One special character"
											/>
											</List>
										</Paper>
									</FormControl>
								)}
							/>
							<Controller
								control={control}
								name="confirmPassword"
								render={({ field }) => (
									<FormControl error={Boolean(errors.confirmPassword)}>
									<InputLabel>Confirm Password</InputLabel>
									<OutlinedInput
										{...field}
										type="password"
									/>
									{errors.confirmPassword ? (
										<FormHelperText>
										{errors.confirmPassword.message}
										</FormHelperText>
									) : null}
									</FormControl>
								)}
							/>
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
