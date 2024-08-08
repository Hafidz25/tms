# 1. Deskripsi

Digunakan untuk mengelola data umum dalam bentuk tabel. Component ini memuat fitur-fitur Data Grid berupa :

- Client-Side Data Grid Component ✔
- Sorting ✔
- Filtering (Search & Faceting) ✔
- Pagination ✔
- Selection ✔
- Visibility ✔
- Data exporting

# 2. Setup

Sebelum menggunakan component template, columns dan konfigurasi fitur perlu disiapkan terlebih dahulu. columns digunakan untuk membentuk column pada table.

## A. Columns

Columns disarankan didefinisikan pada file terpisah, seperti `data-grid-columns.tsx` :

```tsx
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { Brief } from "@/types/brief";
import { createColumns } from "@/lib/data-grid/columns";
import { Badge } from "@/components/ui/badge";
import {
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
} from "@/components/data-grid/shadcn";

const FORMAT_DATE = "LLL dd, y";

export const columns = createColumns<Brief>((column) => [
  column.display({
    id: "select",
    enableHiding: false,

    header: ({ table }) => <DataGridRowSelection scope="all" table={table} />,

    cell: ({ row }) => <DataGridRowSelection scope="single" row={row} />,
  }),

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

    enableHiding: false,
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

    filterFn: 'arrIncludesSome',
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
    cell: ({ row, table }) => {
      return (
        <div className="w-max">
          <DataGridRowActions row={row} table={table} />
        </div>
      );
    },

    meta: {
      cell: {
        className: "flex justify-end max-w-full min-w-[70px] pr-6",
      },
    },
  }),
]);


```

## B. Konfigurasi Fitur

Bagian ini juga disarankan untuk didefinisikan pada file terpisah, seperti `data-grid-config.ts` :

```ts
import { FacetFilterCombobox } from "@/components/data-grid/shadcn";
import { BriefsStatus } from "@/types/brief";

export const statusOption: FacetFilterCombobox[] = ([
  "Assigned",
  "Correction",
  "Done",
  "In Review",
  "Waiting for Client Feedback",
] satisfies BriefsStatus[]).map((s) => ({
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

Fitur utama yang dibangun sebagai dasar component. Fitur ini harus diterapkan dengan aturan yang ada pada high level (template) component. Contoh penerapan :

```tsx
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import {
  DataGridTemplate,
  DataGridShadcnTemplateFeatureConfig,
} from "@/components/data-grid/shadcn";
import { createBriefs } from "@/data/briefs";
import { columns } from "./data-grid-columns";
import { statusOption } from "./data-grid-config";
import { Brief } from "@/types/brief";

export default function DebugPage() {
  const featureConfig: DataGridShadcnTemplateFeatureConfig<Brief> = {
    main: {
      filter: {
        searching: "title",
        faceting: {
          status: ["combobox", statusOption],
        },
      },

      rowSelection: {
        onDelete: (selectedData) => console.log(selectedData),
      },
    },

    incremental: {
      addData: {
        text: "Add Brief",
        link: "/dashboard/briefs/create",
      },

      rowActions: {
        detail: (rowData) => `/dashboard/briefs/${rowData.id}`,
        deleteData: (rowData) => console.log(rowData),
      },
    },
  };

  return (
    <DashboardPanel>
      <DataGridTemplate
        title="Data Briefs"
        data={createBriefs({ amount: 30 })}
        columns={columns}
        featureConfig={featureConfig}
      />
    </DashboardPanel>
  );
}
```

Fitur-fitur ini terdiri dari :

### a. Title

Digunakan untuk menampilkan judul component.

### b. Filter

Digunakan untuk menyaring data berdasarkan kondisi tertentu. Ini dibagi menjadi dua sub fitur utama yaitu **Search Filter** dan **Faceting Filter**. Search filter digunakan untuk melakukan filter berdasarkan kata kunci pencarian, Faceting filter digunakan untuk melakukan filter berdasarkan kelompok / column tertentu.

Search filter hanya didapat diterapkan pada satu column dan Faceting filter dapat diterapkan untuk beberapa column. Setiap jenis sub filter, memiliki konfigurasi yang berbeda.

### c. Column Visibility

Digunakan untuk menyembunyikan column tertentu.

### d. Row Selection

Digunakan untuk memilih (select) row. Fitur ini juga dibangun dengan bulk delete.

### e. Sorting

Digunakan untuk mengurutkan cell column sesuai dengan type data pada cell tersebut.

### f. Pagination

Digunakan untuk membagi rows (data) menjadi beberapa halaman.

## B. Incremental

Fitur tambahan yang pada component. Fitur juga ini harus diterapkan dengan aturan yang ada pada high level (template) component.
