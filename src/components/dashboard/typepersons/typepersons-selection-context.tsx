"use client";

import * as React from "react";

import { useSelection } from "@/hooks/use-selection";
import type { Selection } from "@/hooks/use-selection";

import type { Typeperson } from "./typepersons-table";

function noop(): void {
	// No operation
}

export interface TypepersonsSelectionContextValue extends Selection {}

export const TypepersonsSelectionContext = React.createContext<TypepersonsSelectionContextValue>({
	deselectAll: noop,
	deselectOne: noop,
	selectAll: noop,
	selectOne: noop,
	selected: new Set(),
	selectedAny: false,
	selectedAll: false,
});

interface TypepersonsSelectionProviderProps {
	children: React.ReactNode;
	typepersons: Typeperson[];
}

export function TypepersonsSelectionProvider({
	children,
	typepersons = [],
}: TypepersonsSelectionProviderProps): React.JSX.Element {
	const typepersonIds = React.useMemo(() => typepersons.map((typeperson) => typeperson.id), [typepersons]);
	const selection = useSelection(typepersonIds);

	return <TypepersonsSelectionContext.Provider value={{ ...selection }}>{children}</TypepersonsSelectionContext.Provider>;
}

export function useTypepersonsSelection(): TypepersonsSelectionContextValue {
	return React.useContext(TypepersonsSelectionContext);
}
