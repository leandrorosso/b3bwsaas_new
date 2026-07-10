"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { Network as NetworkIcon } from "@phosphor-icons/react/dist/ssr/network";
import { Ruler as RulerIcon } from "@phosphor-icons/react/dist/ssr/ruler";
import { MapPin as MapPinIcon } from "@phosphor-icons/react/dist/ssr/mappin";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { UserCircle as UserCircleIcon } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { UsersThree as UsersThreeIcon } from "@phosphor-icons/react/dist/ssr/UsersThree";

import type { NavItemConfig } from "@/types/nav";
import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";

// NOTE: First level elements are groups.

const icons = {
	"lock-key": LockKeyIcon,
	"user-circle": UserCircleIcon,
	"users-three": UsersThreeIcon,
	bell: BellIcon,
	ruler: RulerIcon,
	mappin: MapPinIcon,
	department: NetworkIcon,
} as Record<string, Icon>;

// Monta a config de navegacao injetando o userId em cada rota como query param.
// Se as rotas do seu projeto forem por segmento dinamico
// (ex: /dashboard/users/[userId]/account), troque a funcao abaixo por algo como
// `${paths.dashboard.users.account(userId)}`.
function buildNavItems(userId: string) {
	return [
		{
			key: "personal",
			title: "Personal",
			items: [
				{
					key: "account",
					title: "Account",
					href: `${paths.dashboard.users.details(userId)}`,
					icon: "user-circle",
				},
				{
					key: "notifications",
					title: "Notifications",
					href: `${paths.dashboard.users.notifications(userId)}`,
					icon: "bell",
				},
				{
					key: "security",
					title: "Security",
					href: `${paths.dashboard.users.security(userId)}`,
					icon: "lock-key",
				},
			],
		},
		{
			key: "organization",
			title: "Organization",
			items: [
				{
					key: "departments",
					title: "Departments",
					href: `${paths.dashboard.users.department(userId)}`,
					icon: "department",
				},
				{
					key: "roles",
					title: "Roles",
					href: `${paths.dashboard.users.team(userId)}`,
					icon: "ruler",
				},
				{
					key: "scales",
					title: "Scales",
					href: `${paths.dashboard.users.scale(userId)}`,
					icon: "mappin",
				},
			],
		},
	] satisfies NavItemConfig[];
}

// Dados minimos do usuario que a SideNav precisa exibir (avatar, nome, email).
// Vem pronto do Server Component (page.tsx), que ja tem acesso ao Prisma.
export interface SideNavUser {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
}

interface SideNavProps {
	userId: string;
	user?: SideNavUser | null;
}

export function SideNav({ userId, user }: SideNavProps): React.JSX.Element {
	const pathname = usePathname();

	const navItems = React.useMemo(() => buildNavItems(userId), [userId]);

	return (
		<div>
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
			</Stack>
			<Stack
				spacing={3}
				sx={{
					flex: "0 0 auto",
					flexDirection: { xs: "column-reverse", md: "column" },
					position: { md: "sticky" },
					top: "64px",
					width: { xs: "100%", md: "240px" },
				}}
			>
				<Stack component="ul" spacing={3} sx={{ listStyle: "none", m: 0, p: 0 }}>
					{navItems.map((group) => (
						<Stack component="li" key={group.key} spacing={2}>
							{group.title ? (
								<div>
									<Typography color="text.secondary" variant="caption">
										{group.title}
									</Typography>
								</div>
							) : null}
							<Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
								{group.items.map((item) => (
									<NavItem {...item} key={item.key} pathname={pathname} />
								))}
							</Stack>
						</Stack>
					))}
				</Stack>
			</Stack>
		</div>
	);
}

interface NavItemProps extends NavItemConfig {
	pathname: string;
}

function NavItem({ disabled, external, href, icon, pathname, title }: NavItemProps): React.JSX.Element {
	const active = isNavItemActive({ disabled, external, href, pathname });
	const Icon = icon ? icons[icon] : null;

	return (
		<Box component="li" sx={{ userSelect: "none" }}>
			<Box
				{...(href
					? {
							component: external ? "a" : RouterLink,
							href,
							target: external ? "_blank" : undefined,
							rel: external ? "noreferrer" : undefined,
						}
					: { role: "button" })}
				sx={{
					alignItems: "center",
					borderRadius: 1,
					color: "var(--mui-palette-text-secondary)",
					cursor: "pointer",
					display: "flex",
					flex: "0 0 auto",
					gap: 1,
					p: "6px 16px",
					textDecoration: "none",
					whiteSpace: "nowrap",
					...(disabled && { color: "var(--mui-palette-text-disabled)", cursor: "not-allowed" }),
					...(active && { bgcolor: "var(--mui-palette-action-selected)", color: "var(--mui-palette-text-primary)" }),
					"&:hover": {
						...(!active &&
							!disabled && { bgcolor: "var(--mui-palette-action-hover)", color: "var(---mui-palette-text-primary)" }),
					},
				}}
				tabIndex={0}
			>
				{Icon ? (
					<Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
						<Icon
							fill={active ? "var(--mui-palette-text-primary)" : "var(--mui-palette-text-secondary)"}
							fontSize="var(--icon-fontSize-md)"
							weight={active ? "fill" : undefined}
						/>
					</Box>
				) : null}
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography
						component="span"
						sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
					>
						{title}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}