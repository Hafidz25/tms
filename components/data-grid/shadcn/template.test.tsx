import React from "react";
import { test, describe, expect, beforeEach, beforeAll, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";
import { setup, ReturnSetup } from "@/lib/test/setup";
import { createColumns } from "@/lib/data-grid/columns";
import { createBriefs } from "@/data/briefs";
import { Brief } from "@/types/briefs";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import {
  DataGridTemplate,
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
  FacetedFilterOptionProps,
} from "@/components/data-grid/shadcn";

type InitializerState = "start" | "done";

// todo: pendekatan yang lebih baik?
type FeatureConfig<S extends InitializerState> = S extends "start"
  ? Partial<DataGridShadcnTemplateFeatureConfig<Brief>>
  : Required<DataGridShadcnTemplateFeatureConfig<Brief>>;

const TITLE = "Data Brief";
const ROOT_LINK = "/dashboard/brief";
const ADD_DATA = {
  text: "Add Brief",
  link: `${ROOT_LINK}/create`,
};

const FORMAT_DATE = "LLL dd, y";
const DATA_AMOUNT = 30;
const STATUS_OPTION: FacetedFilterOptionProps[] = [
  "Assigned",
  "Correction",
  "Done",
  "In Review",
  "Waiting Client Feedback",
].map((s) => ({
  value: s,
  label: s,
}));

let DATA: Brief[] = [];
let COLUMNS: ColumnDef<Brief, any>[] = [];
let FEATURE_CONFIG: FeatureConfig<"start"> = {};
let SETUP_TEST: ReturnSetup | Object = {};

beforeAll(() => {
  DATA = createBriefs({ amount: DATA_AMOUNT });

  COLUMNS = createColumns<Brief>((column) => [
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

      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
        const featureConfig = table.options.meta
          ?.featureConfig as DataGridShadcnTemplateFeatureConfig<Brief>;

        return (
          <div className="w-max">
            <DataGridRowActions
              row={row}
              detail={featureConfig?.incremental.rowActions.detail}
              deleteData={featureConfig.incremental.rowActions.deleteData}
            />
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

  FEATURE_CONFIG = {
    main: {
      rowSelection: {
        onDelete: vi.fn(),
      },

      filter: {
        searching: "title",
        faceting: {
          status: STATUS_OPTION,
        },
      },
    },

    incremental: {
      rowActions: {
        deleteData: (rowData) => console.log(rowData),
        detail: (rowData) => `${ROOT_LINK}/detail/${rowData.id}`,
      },

      addData: {
        text: ADD_DATA.text,
        link: ADD_DATA.link,
      },
    },
  } as Required<DataGridShadcnTemplateFeatureConfig<Brief>>;

  // cleanup function
  return () => {
    DATA = [];
    COLUMNS = [];
  };
});

beforeEach(() => {
  SETUP_TEST = setup(
    <DataGridTemplate
      title={TITLE}
      data={DATA}
      columns={COLUMNS}
      featureConfig={FEATURE_CONFIG as FeatureConfig<"done">}
    />,
  );
});

describe("Inisialisasi DataGridTemplate", () => {
  test("Memiliki data, columns, dan judul", () => {
    const { container } = SETUP_TEST as ReturnSetup;

    const title = screen.getByRole("heading", {
      name: TITLE,
    });

    const tableBody = container.querySelector("tbody");

    expect(title.textContent).toBe(TITLE);
    expect(tableBody?.children.length).not.toBe(0);
  });
});

describe("Row Selection DataGridTemplate", () => {
  // Per rows -> All Rows -> Clear
  test("Memilih rows pada current page", async () => {
    const { container, user } = SETUP_TEST as ReturnSetup;

    const allRowSelection = screen.getByRole("checkbox", {
      name: /select all/i,
    });

    const firstRowBody = container.querySelector("tbody")
      ?.firstElementChild as HTMLElement;

    const firstRowSelection = within(firstRowBody).getByRole("checkbox", {
      name: /select row/i,
    });

    const getRowSelectionIndicator = () =>
      screen.getByText(/.*(row\(s\) selected)/i).textContent;

    // Check row body pertama
    expect(getRowSelectionIndicator()).toContain(`0 of ${DATA_AMOUNT}`);
    expect(firstRowSelection).not.toBeChecked();

    await user.click(firstRowSelection);

    expect(getRowSelectionIndicator()).toContain(`1 of ${DATA_AMOUNT}`);
    expect(firstRowSelection).toBeChecked();

    // Check semua body row pada current page
    await user.click(allRowSelection);

    expect(getRowSelectionIndicator()).toContain(`10 of ${DATA_AMOUNT}`);
    expect(allRowSelection).toBeChecked();

    // Uncheck  semua body row pada current page
    await user.click(allRowSelection);

    expect(getRowSelectionIndicator()).toContain(`0 of ${DATA_AMOUNT}`);
    expect(allRowSelection).not.toBeChecked();
    expect(firstRowBody).not.toBeChecked();
  });

  // Component `DataGridRowSelectionBulkDelete`
  // All & Selected Rows
  test("Konfirmasi dan pembatalan penghapusan rows", async () => {
    const { user, container, debug } = SETUP_TEST as ReturnSetup;
    const onDelete = FEATURE_CONFIG.main!.rowSelection.onDelete;

    const firstRowBody = container.querySelector("tbody")
      ?.firstElementChild as HTMLElement;

    const firstRowSelection = within(firstRowBody).getByRole("checkbox", {
      name: /select row/i,
    });

    const getRowSelectionBulkDelete = () =>
      screen.getByRole("button", {
        name: /(delete ((all)|\([0-9]{1,}\)))/i,
      });

    const getRowSelectionBulkDeleteConfirm = () =>
      screen.getByRole("button", {
        name: /confirm/i,
      });

    const getRowSelectionBulkDeleteCancel = () =>
      screen.getByRole("button", {
        name: /cancel/i,
      });

    // Delete All Rows
    await user.click(getRowSelectionBulkDelete());
    await user.click(getRowSelectionBulkDeleteConfirm());

    expect(onDelete).toHaveBeenCalled();

    // Delete Selected Rows
    await user.click(firstRowSelection);

    expect(getRowSelectionBulkDelete().textContent).toMatch(/delete \(1\)/i);

    await user.click(getRowSelectionBulkDelete());
    await user.click(getRowSelectionBulkDeleteConfirm());

    expect(onDelete).toHaveBeenCalledTimes(2);

    // Cancel Delete
    await user.click(getRowSelectionBulkDelete());
    await user.click(getRowSelectionBulkDeleteCancel());

    expect(onDelete).not.toHaveBeenCalledTimes(3);
  });
});

describe("Filter DataGridTemplate", () => {
  test("Melakukan filter & reset search", async () => {
    const { user, container, debug } = SETUP_TEST as ReturnSetup;

    const input = screen.getByPlaceholderText(/((search title)[.]*)/i);
    const tableBody = container.querySelector("tbody");
    const getResetBtn = () =>
      screen.queryByRole("button", {
        name: /reset/i,
      });

    // search `judul 10`
    expect(tableBody?.children.length).not.toBe(0);
    expect(getResetBtn()).toBeNull();
    expect(input).toBeVisible();

    await user.type(input, "10");

    expect(tableBody?.children.length).toBe(1);

    // Reset filter search
    expect(getResetBtn()).toBeVisible();

    await user.click(getResetBtn()!);

    expect(tableBody?.children.length).not.toBe(1);
    expect(getResetBtn()).toBeNull();
  });

  test.todo("Melakukan filter & reset faceting", async () => {
    const { debug } = SETUP_TEST as ReturnSetup;
    const facetsBtn = screen.queryByRole("button", {
      name: 'Status',
    });

  });
});

describe.todo("Sorting DataGridTemplate", () => {
  test.todo("Descending, Ascending, Reset order (title column)");
});

describe.todo("Column Visibility DataGridTemplate", () => {
  test.todo("Menghapus & Mengembalikan column status");
});

describe.todo("Pagination DataGridTemplate", () => {
  // Default (10 = 1 of 3) -> Update -> (30 = 1 of 1)
  test.todo("Membatasi jumlah rows yang ditampilan");

  // Next -> Back -> Double Next
  test.todo("Page Navigation");
});
