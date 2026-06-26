import type * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { AccountDetails } from "@/components/dashboard/settings/account-details";
import { DeleteAccount } from "@/components/dashboard/settings/delete-account";
import { Privacy } from "@/components/dashboard/settings/privacy";
import { ThemeSwitch } from "@/components/dashboard/settings/theme-switch";
import { getUser } from "@/lib/custom-auth/server";
import { redirect } from "next/navigation";
import { paths } from "@/paths";

export const metadata = { title: `Account | Settings | Dashboard | ${appConfig.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
	const { data } = await getUser();

	if (!data?.user) {
    	redirect(paths.auth.custom.signIn);
	}

	return (
		<Stack spacing={4}>
			<div>
				<Typography variant="h4">Account</Typography>
			</div>
			<Stack spacing={4}>
				<AccountDetails />
				<ThemeSwitch />
				<Privacy />
				<DeleteAccount />
			</Stack>
		</Stack>
	);
}

