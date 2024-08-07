import { createContext, useContext } from "react";
import { DataGridShadcnTemplateFeatureConfig } from "./parts";
import { Table, TableData } from "@tanstack/react-table";

export type ContextProps<TData extends TableData> = {
  table: Table<TData>;
  featureConfig?: DataGridShadcnTemplateFeatureConfig<TData>;
} | null;

export function useDataGridTemplateContext() {
  return useContext(DataGridTemplateContext) as NonNullable<ContextProps<TableData>>;
}

export const DataGridTemplateContext = createContext<ContextProps<any>>(null);
