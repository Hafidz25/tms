import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { capitalize } from "lodash-es";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
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
  FacetedFilterOptionProps,
  DataGridVisibility,
} from "./parts";

/**
 * TODO!!! :
 * @todo fleksibilitas toolbar right
 * @todo component fitur row selection (perlu pemahaman portal, untuk dialog bulk delete)
 * @todo fleksibilitas component Row Action (perlu pemahaman portal)
 * @todo menyusun dokumentasi component template
 * @todo testing semua component
 *
 * @todo perbaiki " Can't perform a React state update" (lihat console). Ini merupakan kesalahan dari library. lihat {@link https://github.com/TanStack/table/issues/5026}
 */

type AtLeastOne<
  T extends Object,
  Keys extends keyof T = keyof T,
> = Keys extends keyof T ? Partial<T> & { [K in Keys]-?: T[K] } : never;

type FacetingConfig<TData extends TableData> = AtLeastOne<
  Record<keyof TData, FacetedFilterOptionProps[]>
>;

interface Props<TData extends TableData, TValue> extends DataGridProps {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  featureConfig: {
    main: {
      filter: {
        /**
         * Digunakan untuk menentukan Column
         * yang akan diterapkan fitur filter search.
         * Column Ini harus bertipe column {@link https://tanstack.com/table/latest/docs/guide/column-defs#column-def-types|`accessor`}. Sesuaikan dengan konfigurasi pada column def!
         *
         * @todo perbaiki type. gunakan teknik conditional type dari `ColumnDef`
         */
        searching: keyof TData;

        /**
         * Digunakan untuk menentukan Column
         * yang akan diterapkan fitur filter faceting.
         * Column Ini harus bertipe column {@link https://tanstack.com/table/latest/docs/guide/column-defs#column-def-types|`accessor`}. Sesuaikan dengan konfigurasi pada column def!
         *
         * Jika fitur digunakan,
         * maka setidaknya harus memiliki satu property.
         * Struktur konfigurasi
         * ini sama dengan `{ columnName: FacetedFilterOption }`
         */
        faceting: FacetingConfig<TData>;
      };
    };
  };
}

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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const isFiltered = table.getState().columnFilters.length > 0;
  const facets = Object.keys(featureConfig.main.filter.faceting);

  return (
    <DataGrid title={title}>
      <DataGridToolbar>
        <DataGridToolbarLeft>
          {/* Fitur Search Filter */}
          <DataGridSearchFilter
            table={table}
            placeholder={`Search ${featureConfig.main.filter.searching as string}...`}
            columnTarget={featureConfig.main.filter.searching}
          />

          {/* Fitur Faceting Filter */}
          <>
            {facets.map((item, i) => (
              <DataGridFacetedFilter
                key={i}
                title={capitalize(item)}
                column={table.getColumn(item)!}
                options={featureConfig.main.filter.faceting[item]!}
              />
            ))}

            {isFiltered && <DataGridFacetedFilterFormatter table={table} />}
          </>
        </DataGridToolbarLeft>

        <DataGridToolbarRight className="flex items-center justify-end space-x-2">
          <Link href="/dashboard/briefs/create">
            <Button size="sm" className="h-8 gap-1" variant={"outline"}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Brief
              </span>
            </Button>
          </Link>

          <DataGridVisibility table={table} />
        </DataGridToolbarRight>
      </DataGridToolbar>
      <DataGridTable table={table} columns={columns} />
      <DataGridPagination table={table} />
    </DataGrid>
  );
}
