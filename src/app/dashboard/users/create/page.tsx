import type * as React from "react";
import type { Metadata } from "next";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { UserCreateForm } from "@/components/dashboard/users/user-create-form";

export const metadata = { title: `Create | Users | Dashboard | ${appConfig.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
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
				<Stack spacing={3}>
					<div>
						<Link
							color="text.primary"
							component={RouterLink}
							href={paths.dashboard.users.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Users
						</Link>
					</div>
					<div>
						<Typography variant="h4">Create user</Typography>
					</div>
				</Stack>
				<UserCreateForm />
			</Stack>
		</Box>
	);
}
