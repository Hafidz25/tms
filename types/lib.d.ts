import { TableCell } from "@/components/ui/table";
import { User } from "./user";

// Butuh penerapan yang lebih baik dengan
// typescript modules

// #Tanstack Table
declare module "@tanstack/table-core" {
  interface TableData {
    [key: string]: any;
  }

  interface BaseFeatureConfig {
    main?: Partial<{ [key: string]: any }>;
    incremental?: Partial<{ [key: string]: any }>;
  }

  interface TableMeta<TData extends TableData<TData>> {
    user?: User;
    featureConfig?: BaseFeatureConfig
  }

  interface ColumnMeta<TData extends TableData, TValue> {
    /** Digunakan untuk menimpa property component cell table */
    cell?: React.ComponentProps<typeof TableCell>;
  }
}
