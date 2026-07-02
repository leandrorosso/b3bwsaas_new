"use client";

import * as React from "react";

import { useSelection } from "@/hooks/use-selection";
import type { Selection } from "@/hooks/use-selection";

import type { User } from "@/generated/prisma/browser";

function noop(): void {
	// No operation
}

export interface UsersSelectionContextValue extends Selection {}

export const UsersSelectionContext = React.createContext<UsersSelectionContextValue>({
	deselectAll: noop,
	deselectOne: noop,
	selectAll: noop,
	selectOne: noop,
	selected: new Set(),
	selectedAny: false,
	selectedAll: false,
});

interface UsersSelectionProviderProps {
	children: React.ReactNode;
	users: User[];
}

export function UsersSelectionProvider({
	children,
	users = [],
}: UsersSelectionProviderProps): React.JSX.Element {
	const userIds = React.useMemo(() => users.map((user) => user.id), [users]);
	const selection = useSelection(userIds);

	return <UsersSelectionContext.Provider value={{ ...selection }}>{children}</UsersSelectionContext.Provider>;
}

export function useUsersSelection(): UsersSelectionContextValue {
	return React.useContext(UsersSelectionContext);
}
