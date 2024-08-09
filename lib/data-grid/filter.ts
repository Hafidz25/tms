import { FilterFn, TableData, Row } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

type DateRangeFilterFn<TData extends TableData> = (row: Row<TData>, id: string, filterValue: DateRange[]) => boolean;

/**
 * Digunakan untuk menerapkan filter custom
 * pada data dengan type `Date`. Function ini 
 * harus digunakan secara bersamaan dengan data filter state
 * dengan type object range (`{from: Date, to: Date}`).
 */
export const dateRange: FilterFn<TableData> = (row, id, filterValue) => {

  return true;
}