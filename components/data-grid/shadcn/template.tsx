import React from "react";
import { useState } from "react";
import { defaultsDeep } from "lodash-es";
import {
  ColumnFiltersState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  TableData,
  Table,
} from "@tanstack/react-table";

import { DataGridTemplateContext } from "./context";
import {
  DataGrid,
  DataGridToolbar,
  DataGridToolbarLeft,
  DataGridToolbarRight,
  DataGridFacetedFilter,
  DataGridFacetedFilterFormatter,
  DataGridPagination,
  DataGridSearchFilter,
  DataGridTable,
  DataGridProps,
  DataGridVisibility,
  DataGridRowSelectionBulkDelete,
  DataGridAppender,
  DataGridShadcnTemplateFeatureConfig,
} from "./parts";

/**
 * TODO!!! :
 * @todo perbaiki `filterValue.toLowerCase() is not function` pada filter faceting option.
 * @todo perbaiki kesalah type pada utils `createColumns` untuk use case data selain brief.
 * @todo full area row selection
 * @todo data exporting feature
 * @todo testing componenet (hide & show features)
 * @todo lazy loading untuk optional features
 *
 * @todo menambahkan filterfn custom (lihat filterFn pada column def)
 * @todo solusi untuk `filterFns` type
 * @todo perbaiki " Can't perform a React state update" (lihat console). Ini merupakan kesalahan dari library. lihat {@link https://github.com/TanStack/table/issues/5026}
 */

export interface Props<TData extends TableData, TValue> extends DataGridProps {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  featureConfig?: DataGridShadcnTemplateFeatureConfig<TData>;
}

const DEFAULT_FEATURE_CONFIG = {
  main: {
    filter: undefined,
    rowSelection: undefined,
    pagination: true,
    columnVisibility: true,
    dataExporter: false,
  },
  incremental: {
    addData: undefined,
    rowActions: undefined,
  },
} satisfies DataGridShadcnTemplateFeatureConfig<TableData>;

export function DataGridTemplate<TData extends TableData, TValue>({
  title = "Judul Tabel",
  data,
  columns,
  featureConfig,
}: Props<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      featureConfig,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const config = !!featureConfig
    ? defaultsDeep(featureConfig, DEFAULT_FEATURE_CONFIG)
    : DEFAULT_FEATURE_CONFIG;

  return (
    <DataGridTemplateContext.Provider
      value={{
        table,
        featureConfig: config,
      }}
    >
      <DataGrid title={title}>
        <DataGridToolbar>
          <DataGridToolbarLeft>
            <DataGridSearchFilter />
            <DataGridFacetedFilter />
            <DataGridFacetedFilterFormatter />
          </DataGridToolbarLeft>

          <DataGridToolbarRight className="flex items-center justify-end space-x-2">
            <DataGridRowSelectionBulkDelete />
            <DataGridAppender />
            <DataGridVisibility />
          </DataGridToolbarRight>
        </DataGridToolbar>

        <DataGridTable />
        <DataGridPagination />
      </DataGrid>
    </DataGridTemplateContext.Provider>
  );
}
