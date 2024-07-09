import { User } from "./user";

// Butuh penerapan yang lebih baik dengan
// typescript modules

// #Tanstack Table
declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    user?: User
  }
}