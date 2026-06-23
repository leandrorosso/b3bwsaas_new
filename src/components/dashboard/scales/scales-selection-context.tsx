"use client";

import * as React from "react";

import { useSelection } from "@/hooks/use-selection";
import type { Selection } from "@/hooks/use-selection";

import type { Scale } from "./scales-table";

function noop(): void {
	// No operation
}

export interface ScalesSelectionContextValue extends Selection {}

export const ScalesSelectionContext = React.createContext<ScalesSelectionContextValue>({
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
	scales: Scale[];
}

export function ScalesSelectionProvider({
	children,
	scales = [],
}: TypepersonsSelectionProviderProps): React.JSX.Element {
	const scaleIds = React.useMemo(() => scales.map((scale) => scale.id), [scales]);
	const selection = useSelection(scaleIds);

	return <ScalesSelectionContext.Provider value={{ ...selection }}>{children}</ScalesSelectionContext.Provider>;
}

export function useScalesSelection(): ScalesSelectionContextValue {
	return React.useContext(ScalesSelectionContext);
}
