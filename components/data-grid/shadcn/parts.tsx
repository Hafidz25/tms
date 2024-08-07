import React from "react";
import Link from "next/link";
import { utils, writeFile } from "xlsx";
import { format, getMonth } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useState } from "react";
import { capitalize } from "lodash-es";
import {
  Table,
  Column,
  flexRender,
  TableData,
  Row,
  BaseFeatureConfig,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Check,
  CirclePlus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
  X,
  CircleX,
  SlidersHorizontal,
  FileDown,
  PlusCircle
} from "lucide-react";

import { cn } from "@/lib/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { User } from "@/types/user";
import { Brief } from "@/types/brief";

import { useDataGridTemplateContext } from "./context";

/**
 * Digunakan untuk memastikan sebuah type object
 * memiliki satu property. Sisa dari property yang
 * didefinisikan akan bersifat opsional.
 */
type AtLeastOne<
  T extends Object,
  Keys extends keyof T = keyof T,
> = Keys extends keyof T ? Partial<T> & { [K in Keys]-?: T[K] } : never;

type FacetingConfig<TData extends TableData> = Partial<
  Record<keyof TData, FacetedFilterOptionProps[]>
>;

export type RowSelectionConfirmDeleteAction<TData extends TableData> = (
  selectedData: TData[],
) => void;

export type FacetedFilterOptionProps = {
  label: string;
  value: string;

  /**
   * TODO:
   * @todo perlu penyesuaian type untuk component icon dari lucide-react
   */
  icon?: React.ComponentType<{ className?: string }>;
};

export type DataGridShadcnTemplateFeatureConfig<TData extends TableData> = {
  main?: {
    filter?: {
      /**
       * Digunakan untuk menentukan Column
       * yang akan diterapkan fitur filter search.
       * Column Ini harus bertipe column {@link https://tanstack.com/table/latest/docs/guide/column-defs#column-def-types|`accessor`}. Sesuaikan dengan konfigurasi pada column def!
       *
       * @todo perbaiki type. gunakan teknik conditional type dari `ColumnDef`
       */
      searching?: keyof TData;

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
      faceting?: FacetingConfig<TData>;
    };

    rowSelection?: {
      /**
       * Callback untuk aksi yang akan dilakukan ketika
       * proses penghapusan data dikonfirmasi.
       */
      onDelete?: RowSelectionConfirmDeleteAction<TData>;
    };

    /**
     * Digunakan untuk menerapkan fitur column visibility.
     */
    columnVisibility?: boolean;

    /**
     * Digunakan untuk menerapkan fitur data exporter.
     * 
     * Solusi sementara menggunakan `DataGridBriefsExporter`.
     * Untuk kedepannya, konfigurasi dan penggunaan component
     * akan berubah.
     */
    dataExporter?: boolean;

    /**
     * Digunakan untuk menerapkan fitur pagination.
     */
    pagination?: boolean;
  };

  incremental?: {
    /**
     * Digunakan untuk mengatur tampilan dan perilaku
     * component penambahan data. Ini meliputi text dan link tombol
     */
    addData?: {
      text?: string;
      link?: string;
    };

    rowActions?: {
      /**
       * Function yang mengembalikan string link untuk detail data.
       * @param rowData data row untuk interpolasi string link.
       */
      detail?: (rowData: TData) => string;

      /**
       * Function yang melakukan aksi penghapusan data row.
       * @param rowData data row untuk operasi penghapusan data.
       */
      deleteData?: (rowData: TData) => void;
    };
  };
} & BaseFeatureConfig;

// ------------------------------------------------------------

export interface DataGridProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Digunakan sebagai root component.
 * Menerima opsi `title` untuk judul data grid.
 */
export function DataGrid(props: DataGridProps) {
  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{props.title}</h2>
      </div>

      <div className="space-y-4">{props.children}</div>
    </div>
  );
}

// ------------------------------------------------------------

interface DataGridToolbarProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {}

/**
 * Digunakan untuk mengatur dan mengelompokkan
 * component fitur data grid seperti search, filter, dll,
 * sebagai Toolbar. Component ini digunakan secara bersamaan
 * dengan component `DataGridToolbarLeft` dan `DataGridToolbarRight`.
 * Umumnya ini digunakan sebagai child dari parent component `DataGrid`
 */
export function DataGridToolbar(props: DataGridToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between", props.className)}>
      {props.children}
    </div>
  );
}

export function DataGridToolbarLeft(props: DataGridToolbarProps) {
  return (
    <div className={cn("flex flex-1 items-center space-x-2", props.className)}>
      {props.children}
    </div>
  );
}

export function DataGridToolbarRight(props: DataGridToolbarProps) {
  return <div {...props}>{props.children}</div>;
}

// ------------------------------------------------------------

interface DataGridSearchFilterProps<TData extends TableData>
  extends React.ComponentProps<typeof Input> {
  table: Table<TData>;

  /**
   * Column yang akan diterapkan fitur filter search.
   * Column Ini harus bertipe column {@link https://tanstack.com/table/latest/docs/guide/column-defs#column-def-types|`accessor`}. Sesuaikan dengan konfigurasi pada column def!
   */
  columnTarget: keyof TData;
}

/**
 * Digunakan untuk menerapkan fitur search column (filter).
 * Component ini umumnya digunakan didalam `DataGridToolbar`.
 */
export function DataGridSearchFilter() {
  const { table, featureConfig } = useDataGridTemplateContext();

  if (!featureConfig || !featureConfig.main?.filter!.searching) return;

  const placeholderInput = `Search ${featureConfig.main?.filter!.searching}...`;

  const column = table.getColumn(featureConfig.main?.filter!.searching as string);

  if (!column) throw new Error("Column target tidak ditemukan!");

  const value = (column?.getFilterValue() as string) ?? "";
  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    column?.setFilterValue(e.currentTarget.value);
  };

  return (
    <Input
      value={value}
      onChange={handleOnChange}
      className="h-8 w-[150px] lg:w-[250px]"
      placeholder={placeholderInput}
    />
  );
}

// ------------------------------------------------------------

interface DataGridFacetedFilterItemProps<TData, TValue> {
  title?: string;

  /** API column dari tanstack table */
  column: Column<TData, TValue>;

  /** Data option filter */
  options: FacetedFilterOptionProps[];
}

/**
 * Digunakan untuk menerapkan fitur faceted column (filter).
 * Component ini umumnya digunakan didalam `DataGridToolbar`.
 */
export function DataGridFacetedFilter() {
  const { table, featureConfig } = useDataGridTemplateContext();

  if (!featureConfig || !featureConfig.main?.filter!.faceting) return;

  const facetKeys = Object.keys(featureConfig.main?.filter!.faceting);

  return (
    <>
      {facetKeys.map((facet, i) => (
        <DataGridFacetedFilterItem
          key={i}
          title={capitalize(facet)}
          column={table.getColumn(facet)!}
          options={featureConfig.main?.filter!.faceting![facet]!}
        />
      ))}
    </>
  );
}

export function DataGridFacetedFilterItem<TData, TValue>({
  options,
  column,
  title,
}: DataGridFacetedFilterItemProps<TData, TValue>) {
  if (!column) throw new Error("Column tidak ditemukan!");

  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const ClearFilters = useCallback(() => {
    return (
      <>
        <CommandSeparator />
        <CommandGroup>
          <CommandItem
            onSelect={() => column?.setFilterValue(undefined)}
            className="justify-center text-center"
          >
            Clear filters
          </CommandItem>
        </CommandGroup>
      </>
    );
  }, [column]);

  const FilterOptionItem = ({
    option,
  }: {
    option: FacetedFilterOptionProps;
  }) => {
    const isSelected = selectedValues.has(option.value);
    const handleSelectFilterOption = () => {
      if (isSelected) {
        selectedValues.delete(option.value);
      } else {
        selectedValues.add(option.value);
      }
      const filterValues = Array.from(selectedValues);
      column?.setFilterValue(filterValues.length ? filterValues : undefined);
    };

    return (
      <CommandItem key={option.value} onSelect={handleSelectFilterOption}>
        <div
          className={cn(
            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
            isSelected && "bg-primary text-primary-foreground",
            !isSelected && "opacity-50 [&_svg]:invisible",
          )}
        >
          <Check className="h-4 w-4" />
        </div>

        <span>{option.label}</span>

        {facets?.get(option.value) && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {facets.get(option.value)}
          </span>
        )}
      </CommandItem>
    );
  };

  const FilterCounter = () => {
    return (
      <>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
          {selectedValues.size}
        </Badge>
      </>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CirclePlus className="mr-2 h-4 w-4" />
          {title}

          {selectedValues?.size > 0 && <FilterCounter />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <FilterOptionItem key={option.value} option={option} />
              ))}
            </CommandGroup>

            {selectedValues.size > 0 && <ClearFilters />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Digunakan untuk mereset fitur faceted column (filter).
 * Component ini umumnya digunakan secara bersamaan
 * dengan component `DataGridFacetedFilter`.
 */
export function DataGridFacetedFilterFormatter() {
  const { table, featureConfig } = useDataGridTemplateContext();
  const isFiltered = table.getState().columnFilters.length > 0;

  if (!featureConfig || !featureConfig.main?.filter!.faceting || !isFiltered)
    return;

  return (
    <Button
      variant="ghost"
      onClick={() => table.resetColumnFilters()}
      className="h-8 px-2 lg:px-3"
    >
      Reset
      <X className="ml-2 h-4 w-4" />
    </Button>
  );
}

// ------------------------------------------------------------

type CheckedState = boolean | "indeterminate";

type RowSelectionInitialConfig = {
  checked: CheckedState;
  onCheckedChange: (value: CheckedState) => void;
  ariaLabel: string;
};

type SelectionScope = "single" | "all";

type DataGridRowSelectionBase = {
  /**
   * Digunakan untuk menentukan jenis tipe component.
   * `single` berarti pemilihan (selection) dilakukan pada satu row.
   * `all` berarti pemilihan dilakukan untuk semua row pada halaman saat ini. ini menggunakan API {@link https://tanstack.com/table/latest/docs/api/features/row-selection#toggleallpagerowsselected|`table.toggleAllPageRowsSelected`}
   */
  scope: SelectionScope;
};

/**
 * Digunakan untuk mengatur modifier required dan optional
 * dari property `row` dan `table`.
 *
 * @todo pendekatan yang lebih baik?
 */
type DataGridRowSelectionProps<
  SType extends SelectionScope,
  TData extends TableData,
> = SType extends "single"
  ? DataGridRowSelectionBase & { row: Row<TData>; table?: Table<TData> }
  : DataGridRowSelectionBase & { row?: Row<TData>; table: Table<TData> };

/**
 * Umumnya digunakan ketika mendefinisikan column def
 * untuk bagian header / cell. Component ini memuat fitur row selection.
 *
 * Jika `scope` berupa `all`, maka opsi `table` bersifat `required` dan opsi `row` berupa `opsional`. Begitu pun sebaliknya, jika `scope` berupa `single` maka `row` bersifat `required` dan `table` berupa `opsional`.
 */
export function DataGridRowSelection<
  SType extends SelectionScope,
  TData extends TableData,
>({ table, row, scope }: DataGridRowSelectionProps<SType, TData>) {
  let initialConfig: Partial<RowSelectionInitialConfig> = {
    checked: undefined,
    onCheckedChange: undefined,
    ariaLabel: undefined,
  };

  switch (scope) {
    case "all": {
      initialConfig.checked =
        table!.getIsAllPageRowsSelected() ||
        (table!.getIsSomePageRowsSelected() && "indeterminate");

      initialConfig.onCheckedChange = (value) =>
        table!.toggleAllPageRowsSelected(!!value);

      initialConfig.ariaLabel = "Select all";

      break;
    }

    case "single": {
      initialConfig.checked = row!.getIsSelected();
      initialConfig.onCheckedChange = (value) => row!.toggleSelected(!!value);
      initialConfig.ariaLabel = "Select row";

      break;
    }

    default: {
      throw new Error(`Scope ${scope} tidak diketahui!`);
    }
  }

  return (
    <Checkbox
      checked={initialConfig.checked}
      onCheckedChange={initialConfig.onCheckedChange}
      aria-label={initialConfig.ariaLabel}
      className="translate-y-[2px]"
    />
  );
}

/**
 * Digunakan untuk menerapkan fitur row selection,
 * khususnya fungsionalitas delete.
 * Component ini umumnya digunakan didalam  `DataGridToolbarRight`.
 *
 * Perilaku yang diterapakan adalah ketika tidak ada row yang dipilih,
 * secara default 'delete' mengacu pada semua rows disemua page (jika ada pagination).
 * Namun jika terdapat row yang dipilih, 'delete' mengacu pada rows yang dipilih saja.
 */
export function DataGridRowSelectionBulkDelete() {
  const { table, featureConfig } = useDataGridTemplateContext();
  const [openModal, setOpenModal] = useState(false);

  if (!featureConfig || !featureConfig.main?.rowSelection) return;

  const isRowsSelected =
    table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected();

  const selectedRowsData = isRowsSelected
    ? table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    : table.getRowModel().rows.map((row) => row.original);

  const deleteType = isRowsSelected ? `(${selectedRowsData?.length})` : "All";

  const deleteMessage = isRowsSelected
    ? `Are you sure you want to delete all selected data (${selectedRowsData?.length})?`
    : "Are you sure you want to delete all data?";

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <CircleX className="mr-2 h-4 w-4" />
          Delete {deleteType}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Selected Data</DialogTitle>
          <DialogDescription>{deleteMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => {
              featureConfig.main?.rowSelection?.onDelete!(selectedRowsData);
              setOpenModal(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------

/**
 * Digunakan untuk merender content table.
 * Umumnya digunakan sebagai child dari `DataGrid` component.
 */
export function DataGridTable() {
  const { table } = useDataGridTemplateContext();
  const columns = table.getAllColumns();

  return (
    <div className="rounded-md border">
      <TablePrimitive>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.cell?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TablePrimitive>
    </div>
  );
}

// ------------------------------------------------------------

interface DataGridCellHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;

  /** API column dari tanstack table */
  column: Column<TData, TValue>;
}

/**
 * Umumnya digunakan ketika mendefinisikan column def
 * untuk bagian header column. Component ini memuat fitur sorting.
 */
export function DataGridCellHeader<TData, TValue>({
  title,
  column,
}: DataGridCellHeaderProps<TData, TValue>) {
  const Indicator = {
    desc: <ArrowDown className="ml-2 h-4 w-4" />,
    asc: <ArrowUp className="ml-2 h-4 w-4" />,
    default: <ChevronsUpDown className="ml-2 h-4 w-4" />,
  };

  const isCanSort = column.getCanSort();
  const isSorted = column.getIsSorted();
  const sortedType = !!isSorted ? isSorted : "default";

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {isCanSort && Indicator[sortedType]}
          </Button>
        </DropdownMenuTrigger>

        {isCanSort && (
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>

            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ChevronsUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Reset
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}

// ------------------------------------------------------------

type DataGridRowActionsProps<TData extends TableData> = {
  row: Row<TData>;
} & NonNullable<DataGridShadcnTemplateFeatureConfig<TData>["incremental"]>;

/**
 * Umumnya ini digunakan sebagai component cell dengan tipe column display
 * pada bagian column defs `cell` options
 */
export function DataGridRowActions<TData extends TableData>({
  row,
  deleteData,
  detail,
}: DataGridRowActionsProps<TData>) {
  const [openModal, setOpenModal] = useState(false);
  const linkDetail = detail(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Link href={linkDetail} className="w-full">
            Detail
          </Link>
        </DropdownMenuItem>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center gap-2"
              onSelect={(e) => {
                e.preventDefault();
                setOpenModal(!openModal);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete data</DialogTitle>
              <DialogDescription>
                Are you sure to delete this data?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                type="reset"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => {
                  deleteData(row.original);
                  setOpenModal(false);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ------------------------------------------------------------

/**
 * Digunakan untuk menerapkan fitur pagination.
 * Umumnya ini digunakan sebagai child dari parent component `DataGrid`
 */
export function DataGridPagination() {
  const {table} = useDataGridTemplateContext();

  const paginationRowsPerPage = table.getState().pagination.pageSize;
  const handleRowsOptionChange = (value: any) => {
    table.setPageSize(Number(value));
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center justify-end space-x-6 px-2 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={paginationRowsPerPage.toString()}
            onValueChange={handleRowsOptionChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={paginationRowsPerPage} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------

/**
 * Digunakan untuk menerapkan fitur column visibility.
 * Umumnya ini digunakan didalam component `DataGridToolbarRight`
 */
export function DataGridVisibility() {
  const { table, featureConfig } = useDataGridTemplateContext();

  if (!featureConfig || !featureConfig.main?.columnVisibility) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ------------------------------------------------------------

interface DataGridBriefsExporterProps {
  users: User[];
  briefs: Brief[];
}

const MONTH = [
  {
    value: "0",
    label: "January",
  },
  {
    value: "1",
    label: "February",
  },
  {
    value: "2",
    label: "March",
  },
  {
    value: "3",
    label: "April",
  },
  {
    value: "4",
    label: "May",
  },
  {
    value: "5",
    label: "June",
  },
  {
    value: "6",
    label: "July",
  },
  {
    value: "7",
    label: "August",
  },
  {
    value: "8",
    label: "September",
  },
  {
    value: "9",
    label: "October",
  },
  {
    value: "10",
    label: "November",
  },
  {
    value: "11",
    label: "December",
  },
];

const FORMAT_DATE = "LLL dd, y";

/**
 * Digunakan untuk mengeksport data briefs.
 * Componenet ini merupakan solusi sementara
 * dari fitur data eksporter.
 */
export function DataGridBriefsExporter({
  briefs,
  users,
}: DataGridBriefsExporterProps) {
  if (!briefs || !users) throw new Error("Tidak ada data Briefs atau Users");

  const { control, register, handleSubmit } = useForm();
  const handleExport = useCallback(
    (data: any) => {
      const briefUser = briefs.filter((user) =>
        user.assign.find(({ id }) => id === data.userId),
      );

      const briefUserbyMonth = briefUser.filter(
        (user) => getMonth(new Date(user.createdAt)).toString() === data.month,
      );

      const dataBrief = briefUserbyMonth.map((user) => {
        return {
          Title: user.title,
          Status: user.status,

          Author: users
            ?.filter((e) => e.id === user.authorId)
            .map((e) => e.name)[0],

          Deadline: !!user.deadline
            ? "-"
            : `${format(user.deadline!.from!, FORMAT_DATE)} - ${format(
                user.deadline!.to!,
                FORMAT_DATE,
              )}`,

          CreatedAt: format(user.createdAt, FORMAT_DATE),
        };
      });

      // Buat work book baru
      const wb = utils.book_new();

      // Ubah data menjadi worksheet
      const ws = utils.json_to_sheet(dataBrief ?? []);

      // Set format kolom
      const wscols = [
        { wch: 30 }, // Lebar kolom A
        { wch: 10 }, // Lebar kolom B
        { wch: 30 }, // Lebar kolom C
        { wch: 30 },
        { wch: 30 },
      ];

      ws["!cols"] = wscols;

      // Set format baris
      const wsrows = [
        { hpx: 20 }, // Tinggi baris
      ];
      ws["!rows"] = wsrows;

      // Set gaya sel
      for (let R = 0; R < dataBrief.length + 1; ++R) {
        for (let C = 0; C < 6; ++C) {
          const cellAddress = utils.encode_cell({ c: C, r: R });
          if (!ws[cellAddress]) continue;

          ws[cellAddress].s = {
            font: {
              name: "Arial",
              sz: 12,
              bold: R === 0, // Buat header tebal
              color: { rgb: R === 0 ? "FFFFFF" : "000000" }, // Warna font (putih untuk header)
            },
            fill: {
              fgColor: { rgb: R === 0 ? "4F81BD" : "D3D3D3" }, // Warna latar belakang (biru untuk header, abu-abu untuk lainnya)
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      // Tambahkan worksheet ke workbook
      utils.book_append_sheet(wb, ws, "Sheet1");

      // Simpan workbook sebagai file
      writeFile(
        wb,
        `${
          users
            ?.filter((user) => user.id === data.userId)
            .map((user) => user.name)[0]
        } - ${
          MONTH.filter((m) => m.value === data.month).map((m) => m.label)[0]
        }.xlsx`,
      );
    },
    [briefs, users],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1" variant="outline">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data Brief</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleExport)} className="grid gap-4 py-4">
          <Controller
            control={control}
            name="userId"
            render={({ field }) => (
              <Select onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((data) => data.role === "Team Member")
                    .map((data, i) => (
                      <SelectItem key={i} value={data.id}>
                        {data.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="month"
            render={({ field }) => (
              <Select onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH.map((data, i) => (
                    <SelectItem key={i} value={data.value}>
                      {data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Button type="submit">Export</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------

/**
 * Digunakan untuk menerapkan fitur incremental 
 * penambahan data. Umumnya diletakkan pada Toolbar right.
 */
export function DataGridAppender() {
  const { featureConfig } = useDataGridTemplateContext();

  if (!featureConfig || !featureConfig.incremental?.addData) return;

  return (
    <Button size="sm" className="h-8 gap-1" variant={"default"} asChild>
      <Link href={featureConfig.incremental?.addData.link!}>
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {featureConfig.incremental.addData.text}
        </span>
      </Link>
    </Button>
  );
}