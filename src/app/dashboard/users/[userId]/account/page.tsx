import type * as React from "react";
import type { Metadata } from "next";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/prisma";
import { SideNav } from "@/components/dashboard/users/side-nav";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Camera as CameraIcon } from "@phosphor-icons/react/dist/ssr/Camera";
import { Option } from "@/components/core/option";

export const metadata = { title: `Details | User | Dashboard | ${appConfig.name}` } satisfies Metadata;

interface PageProps {
	params: {
		userId: string;
	};
}

export default async function Page({ params }: PageProps): Promise<React.JSX.Element> {
	const { userId } = await params;

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		console.error(`User with id ${userId} not found.`);
		return (
			<Box
				sx={{
					maxWidth: "var(--Content-maxWidth)",
					m: "var(--Content-margin)",
					p: "var(--Content-padding)",
					width: "var(--Content-width)",
				}}
			>
				<Typography variant="h4">User not found</Typography>
			</Box>
		);
	}

	return (
			<Card>
				<CardHeader
					avatar={
						<Avatar>
							<UserIcon fontSize="var(--Icon-fontSize)" />
						</Avatar>
					}
					title="Basic details"
				/>
				<CardContent>
					<Stack spacing={3}>
						<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
							<Box
								sx={{
									border: "1px dashed var(--mui-palette-divider)",
									borderRadius: "50%",
									display: "inline-flex",
									p: "4px",
								}}
							>
								<Box sx={{ borderRadius: "inherit", position: "relative" }}>
									<Box
										sx={{
											alignItems: "center",
											bgcolor: "rgba(0, 0, 0, 0.5)",
											borderRadius: "inherit",
											bottom: 0,
											color: "var(--mui-palette-common-white)",
											cursor: "pointer",
											display: "flex",
											justifyContent: "center",
											left: 0,
											opacity: 0,
											position: "absolute",
											right: 0,
											top: 0,
											zIndex: 1,
											"&:hover": { opacity: 1 },
										}}
									>
										<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
											<CameraIcon fontSize="var(--icon-fontSize-md)" />
											<Typography color="inherit" variant="subtitle2">
												Select
											</Typography>
										</Stack>
									</Box>
									<Avatar src="/assets/avatar.png" sx={{ "--Avatar-size": "100px" }} />
								</Box>
							</Box>
							<Button color="secondary" size="small">
								Remove
							</Button>
						</Stack>
						<Stack spacing={2}>
							<FormControl>
								<InputLabel>Full name</InputLabel>
								<OutlinedInput defaultValue={user?.name ?? ""} name="fullName" />
							</FormControl>
							<FormControl disabled>
								<InputLabel>Email address</InputLabel>
								<OutlinedInput name="email" type="email" value={user?.email ?? ""} />
								<FormHelperText>
									Please <Link variant="inherit">contact us</Link> to change your email
								</FormHelperText>
							</FormControl>
							<Stack direction="row" spacing={2}>
								<FormControl sx={{ width: "160px" }}>
									<InputLabel>Dial code</InputLabel>
									<Select
										name="countryCode"
										startAdornment={
											<InputAdornment position="start">
												<Box
													alt="Spain"
													component="img"
													src="/assets/flag-es.svg"
													sx={{ display: "block", height: "20px", width: "auto" }}
												/>
											</InputAdornment>
										}
										value="+34"
									>
										<Option value="+1">United States</Option>
										<Option value="+49">Germany</Option>
										<Option value="+34">Spain</Option>
									</Select>
								</FormControl>
								<FormControl sx={{ flex: "1 1 auto" }}>
									<InputLabel>Phone number</InputLabel>
									<OutlinedInput defaultValue="965 245 7623" name="phone" />
								</FormControl>
							</Stack>
							<FormControl>
								<InputLabel>Title</InputLabel>
								<OutlinedInput name="title" placeholder="e.g Golang Developer" />
							</FormControl>
							<FormControl>
								<InputLabel>Biography (optional)</InputLabel>
								<OutlinedInput name="bio" placeholder="Describe yourself..." />
								<FormHelperText>0/200 characters</FormHelperText>
							</FormControl>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button color="secondary">Cancel</Button>
					<Button variant="contained">Save changes</Button>
				</CardActions>
			</Card>
	);
}