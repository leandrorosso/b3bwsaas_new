// @/hooks/use-current-user.ts
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/custom-auth/browser";
import type { User } from "@/lib/custom-auth/types";
import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";

export function useCurrentUser() {
	const router = useRouter();
	const [user, setUser] = React.useState<User | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		let active = true;

		const checkUser = async () => {
			const { data: res } = await getUser();

			if (!active) return;

			if (!res?.user) {
				logger.debug("[Sign in] User is not authenticated, redirecting to sign in");
				router.replace(paths.auth.custom.signIn);
				return;
			}

			setUser(res.user);
			setIsLoading(false);
		};

		void checkUser();

		return () => {
			active = false;
		};
	}, [router]);

	return { user, isLoading };
}