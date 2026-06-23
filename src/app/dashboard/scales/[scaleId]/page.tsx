import type * as React from "react";
import type { Metadata } from "next";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/prisma";
import { ScaleEditForm } from "@/components/dashboard/scales/scales-edit-form";

export const metadata = { title: `Details | Scales | Dashboard | ${appConfig.name}` } satisfies Metadata;

interface PageProps {
  params: {
    scaleId: string;
  };
}

export default async function Page({ params }: PageProps): Promise<React.JSX.Element>  {

	const { scaleId } = await params;

	const response = await prisma.scale.findUnique({
		where: {
			id: scaleId,
		},
	});

	if (!response) {
		console.error(`Scale with id ${scaleId} not found.`);
		return (
			<Box
				sx={{
					maxWidth: "var(--Content-maxWidth)",
					m: "var(--Content-margin)",
					p: "var(--Content-padding)",
					width: "var(--Content-width)",
				}}
			>
				<Typography variant="h4">Scale not found</Typography>
			</Box>
		);
	}

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
				<div>
					<Link
						color="text.primary"
						component={RouterLink}
						href={paths.dashboard.scales.list}
						sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
						variant="subtitle2"
					>
						<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
						Scales
					</Link>
				</div>
				<div>
					<Typography variant="h4">Edit scale</Typography>
				</div>
				<ScaleEditForm
					scale={{
						id: response.id,
						name: response.name,
						inactive: response.inactive,
					}}
				/>
			</Stack>
		</Box>
	);
}