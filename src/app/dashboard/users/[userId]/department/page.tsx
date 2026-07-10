import type * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { redirect } from "next/navigation";
import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { Scales } from "@/components/dashboard/settings/scales";
import { getScalesData } from "@/app/dashboard/scales/_data-access/get-all-scales";
import { getUser } from "@/lib/custom-auth/server";

export const metadata = { title: `Scale | Settings | Dashboard | ${appConfig.name}` } satisfies Metadata;

export default async function Page():  Promise<React.JSX.Element> {
	const { data: res } = await getUser();

	if (!res?.user) {
		logger.debug("[Sign in] User is authenticated, redirecting to dashboard");
		redirect(paths.auth.custom.signIn);
	}

  	const { allScales, userScales } = await getScalesData(res.user.id);

	return (
		<Stack spacing={4}>
			<div>
				<Typography variant="h4">Scales</Typography>
			</div>
			<Scales
      			scales={allScales}
      			userScales={userScales}
			/>
		</Stack>
	);
}
