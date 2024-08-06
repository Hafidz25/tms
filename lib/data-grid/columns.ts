import {
  createColumnHelper,
  ColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";

export function createColumns<TData extends unknown>(
  generator: (column: ColumnHelper<TData>) => ColumnDef<TData, any>[],
) {
  const helper = createColumnHelper<TData>();
  const columns = generator(helper);
  return columns;
}


