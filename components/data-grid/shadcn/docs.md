# 1. Deskripsi

Digunakan untuk mengelola data umum dalam bentuk tabel. Component ini memuat fitur-fitur Data Grid berupa :

- Client-Side Data Grid Component ✔
- Sorting ✔
- Filtering (Search & Faceting) ✔
- Pagination ✔
- Selection
- Visibility

# 2. Setup

Sebelum menggunakan component template, columns dan konfigurasi fitur perlu disiapkan terlebih dahulu. columns digunakan untuk membentuk column pada table.

## A. Columns

Columns disarankan didefinisikan pada file terpisah, seperti `data-grid-columns.tsx` :

```tsx
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Brief } from "@/types/briefs";
import { createColumns } from "@/lib/data-grid/columns";
import { Badge } from "@/components/ui/badge";
import {
  DataGridCellHeader,
  DataGridRowActions,
} from "@/components/data-grid/shadcn/parts";

const FORMAT_DATE = "LLL dd, y";

export const columns = createColumns<Brief>((column) => [
  column.accessor("title", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Title" />
    ),

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="w-[500px] truncate font-medium">
          {row.getValue("title")}
        </span>
      </div>
    ),
  }),

  column.accessor("status", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Status" />
    ),

    cell: ({ row }) => (
      <div className="flex w-[180px] items-center">
        <Badge>{row.getValue("status")}</Badge>
      </div>
    ),

    filterFn: "arrIncludes",
  }),

  column.accessor("deadline", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Deadline" />
    ),

    cell: ({ row }) => {
      const date = row.getValue("deadline") satisfies DateRange | undefined;

      if (!date) return "-";
      return (
        <div className="flex w-[180px] items-center">
          <>
            {date.from ? format(date.from, FORMAT_DATE) : ""}
            {date.to ? `- ${format(date.to, FORMAT_DATE)}` : ""}
          </>
        </div>
      );
    },
  }),

  column.accessor("createdAt", {
    header: ({ column }) => (
      <DataGridCellHeader column={column} title="Created At" />
    ),

    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>{format(row.getValue("createdAt"), FORMAT_DATE)}</span>
      </div>
    ),
  }),

  column.display({
    id: "actions",
    enableHiding: false,
    cell: (props) => (
      <div className="flex w-[80px] justify-end">
        <DataGridRowActions {...props} />
      </div>
    ),
  }),
]);
```

## B. Konfigurasi Fitur

Bagian ini juga disarankan untuk didefinisikan pada file terpisah, seperti `data-grid-config.ts` :

```ts
export const statusOption = [
  "Assigned",
  "Correction",
  "Done",
  "In Review",
  "Waiting Client Feedback",
].map((s) => ({
  value: s,
  label: s,
}));
```

## C. Menggunakan Component Template

```tsx
import { DataGridTemplate } from "@/components/data-grid/shadcn";
import { columns } from "./data-grid-columns";
import { statusOption } from "./data-grid-config";

<DataGridTemplate
  title="Data Brief"
  data={createBriefs({ amount: 20 })}
  columns={columns}
  {...}
/>;
```

# 3. Fitur

Data Grid Shadcn memiliki fitur-fitur yang dapat dikategorikan menjadi dua jenis yaitu **Main** dan **Incremntal**.

## A. Main

Fitur utama yang dibangun sebagai dasar component. Fitur ini harus diterapkan dengan aturan yang ada pada high level (template) component. Fitur-fitur ini terdiri dari :

### a. Title

Digunakan untuk menampilkan judul component. contoh penerapan :

```tsx
import { DataGridTemplate } from "@/components/data-grid/shadcn";
import { columns } from "./data-grid-columns";

<DataGridTemplate title="Data Brief" {...} />
```

### b. Filter

Digunakan untuk menyaring data berdasarkan kondisi tertentu. Ini dibagi menjadi dua sub fitur utama yaitu **Search Filter** dan **Faceting Filter**. Search filter digunakan untuk melakukan filter berdasarkan kata kunci pencarian, Faceting filter digunakan untuk melakukan filter berdasarkan kelompok / column tertentu.

Search filter hanya didapat diterapkan pada satu column dan Faceting filter dapat diterapkan untuk beberapa column. Setiap jenis sub filter, memiliki konfigurasi yang berbeda. contoh penerapan :

```tsx

import { DataGridTemplate } from "@/components/data-grid/shadcn";
import { columns } from "./data-grid-columns";

<DataGridTemplate title="Data Brief" {...} />

```