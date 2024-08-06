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
import { BriefsStatus } from "@/types/briefs";

import {
  DataGridTemplate,
  DataGridCellHeader,
  DataGridRowActions,
  DataGridRowSelection,
  DataGridShadcnTemplateFeatureConfig,
  FacetedFilterOptionProps,
} from "@/components/data-grid/shadcn";

type StatusOptions = Lowercase<BriefsStatus>;
type FilterStatusOptions<T extends StatusOptions> = T extends StatusOptions
  ? T
  : never;
type InitializerState = "start" | "done";
type SortingType = "asc" | "desc" | "reset";

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
        deleteData: vi.fn(),
        detail: vi.fn((rowData) => `${ROOT_LINK}/detail/${rowData.id}`),
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

describe("Main Features", () => {
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

  describe("Sorting DataGridTemplate", () => {
    test("Descending, Ascending, Reset order (status column)"),
      async () => {
        const { container, user } = SETUP_TEST as ReturnSetup;

        const columnHeaderStatus = screen.getByRole("columnheader", {
          name: /status/i,
        });

        const sortingStatusBtn = within(columnHeaderStatus).getByRole(
          "button",
          {
            name: /status/i,
          },
        );

        const getFirstRowBody = () =>
          container.querySelector("tbody")?.firstElementChild as HTMLElement;

        const getMenuItemSorting = (type: SortingType) =>
          screen.getByRole("menuitem", {
            name: type,
          });

        const getCheckItem = (
          type: FilterStatusOptions<"assigned" | "waiting client feedback">,
        ) => within(getFirstRowBody()).getByText(type, { exact: false });

        // Descending
        await user.click(sortingStatusBtn);
        await user.click(getMenuItemSorting("desc"));

        expect(getCheckItem("waiting client feedback")).toBeVisible();

        // Ascending
        await user.click(sortingStatusBtn);
        await user.click(getMenuItemSorting("asc"));

        expect(getCheckItem("assigned")).toBeVisible();

        // Reset
        await user.click(sortingStatusBtn);

        expect(getMenuItemSorting("reset")).toBeVisible();

        await user.click(getMenuItemSorting("reset"));

        expect(getMenuItemSorting("reset")).not.toBeInTheDocument();
      };
  });

  describe("Pagination DataGridTemplate", () => {
    // Default (10 = 1 of 3) -> Update -> (30 = 1 of 1)
    test("Membatasi jumlah rows yang ditampilan", async () => {
      const { container, user } = SETUP_TEST as ReturnSetup;

      const tableBody = container.querySelector(
        "tbody",
      ) as HTMLTableSectionElement;
      const paginationRowsOption = screen.getByRole("combobox");
      const getPaginationRowsOption = () =>
        screen.getByRole("option", {
          name: DATA_AMOUNT.toString(),
        });

      // Check Rows Default = 10
      expect(tableBody.children.length).toBe(10);

      // Update Rows
      await user.click(paginationRowsOption);
      await user.click(getPaginationRowsOption());

      expect(tableBody.children.length).toBe(DATA_AMOUNT);
    });

    // Next -> Back -> Double Next
    test("Page Navigation", async () => {
      const { user } = SETUP_TEST as ReturnSetup;

      const nextBtn = screen.getByRole("button", {
        name: /go to next page/i,
      });

      const doubleNextBtn = screen.getByRole("button", {
        name: /go to last page/i,
      });

      const getBackBtn = () =>
        screen.queryByRole("button", {
          name: /go to previous page/i,
        });

      const getPageIndicator = () => screen.getByText(/(page [1-3] of 3)/i);

      // Next
      expect(getBackBtn()).toBeDisabled();

      await user.click(nextBtn);

      expect(getPageIndicator().textContent).toContain("2 of 3");

      // Back
      expect(getBackBtn()).not.toBeDisabled();

      await user.click(getBackBtn()!);

      expect(getPageIndicator().textContent).toContain("1 of 3");

      // Double Next (last page)
      await user.click(doubleNextBtn);

      expect(getPageIndicator().textContent).toContain("3 of 3");
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

    /**
     * Skenario :
     *
     * # Filtering
     * 1. menampilkan seluruh rows
     * 2. jumlah table rows harus sama dengan DATA_AMOUNT
     * 3. melakukan filter faceting status ('done')
     * 4. jumlah table rows harus tidak sama dengan DATA_AMOUNT
     * 5. row terakhir pada column status harus berupa 'done'
     *
     * # Reset
     * 6. tombol reset harus ada
     * 7. tekan tombol reset
     * 8. jumlah table rows harus sama dengan DATA_AMOUNT
     */
    test("Melakukan filter & reset faceting", async () => {
      const { container, user, debug } = SETUP_TEST as ReturnSetup;
      const FILTER_TARGET: StatusOptions = "done";

      const paginationRowsOption = screen.getByRole("combobox");

      const getTableBody = () =>
        container.querySelector("tbody") as HTMLTableSectionElement;
      const getPaginationRowsOption = () =>
        screen.getByRole("option", {
          name: DATA_AMOUNT.toString(),
        });

      const input = screen.getByPlaceholderText(/((search title)[.]*)/i);
      const facetsFilter = input.nextElementSibling;

      const getLastRowBody = () =>
        getTableBody().lastElementChild as HTMLTableRowElement;
      const getCheckTarget = (
        type: FilterStatusOptions<typeof FILTER_TARGET | "assigned">,
      ) =>
        within(getLastRowBody()).queryByText(FILTER_TARGET, { exact: false });

      const getResetBtn = () =>
        screen.queryByRole("button", {
          name: /reset/i,
        });

      const getFacetFilterOption = () =>
        screen.getByRole("option", {
          name: /(done [0-9]{1,})/i,
        });

      // Filtering
      await user.click(paginationRowsOption);
      await user.click(getPaginationRowsOption());

      expect(getTableBody().children.length).toBe(DATA_AMOUNT);

      await user.click(facetsFilter!);
      await user.click(getFacetFilterOption());

      expect(getTableBody().children.length).not.toBe(DATA_AMOUNT);
      expect(getCheckTarget("done")).toBeInTheDocument();
      expect(getCheckTarget("done")).toBeVisible();

      // Reset
      expect(getResetBtn()).toBeInTheDocument();
      expect(getResetBtn()).toBeVisible();

      await user.click(getResetBtn()!);

      expect(getTableBody().children.length).toBe(DATA_AMOUNT);
    });
  });

  describe("Column Visibility DataGridTemplate", () => {
    test("Menghapus & Mengembalikan column status", async () => {
      const { user } = SETUP_TEST as ReturnSetup;

      const columnVisibilityBtn = screen.getByRole("button", {
        name: /view/i,
      });

      const getColumnheader = () =>
        screen.queryByRole("columnheader", {
          name: /status/i,
        });

      const getMenuItemColumnVisibility = () =>
        screen.getByRole("menuitemcheckbox", {
          name: /status/i,
        });

      // Delete Column
      expect(getColumnheader()).toBeInTheDocument();

      await user.click(columnVisibilityBtn);
      await user.click(getMenuItemColumnVisibility());

      expect(getColumnheader()).not.toBeInTheDocument();

      // Restore Column
      await user.click(columnVisibilityBtn);
      await user.click(getMenuItemColumnVisibility());

      expect(getColumnheader()).toBeInTheDocument();
    });
  });
});

describe("Incremental Features", () => {
  describe("Row Actions", () => {
    test("Detail Data", async () => {
      const { container, user } = SETUP_TEST as ReturnSetup;

      const firstRowBody = container.querySelector("tbody")
        ?.firstElementChild as HTMLTableRowElement;
      const firstRowBodyMenu = within(firstRowBody).getByRole("button", {
        name: /open menu/i,
      });

      const getDetailOption = (): HTMLLinkElement =>
        screen.getByRole("link", {
          name: /detail/i,
        });

      await user.click(firstRowBodyMenu);

      expect(getDetailOption().href).toContain(ROOT_LINK + "/detail/");
    });

    test("Confirm & Cancel Delete Data", async () => {
      const { container, user } = SETUP_TEST as ReturnSetup;

      const deleteMethod = FEATURE_CONFIG.incremental?.rowActions.deleteData;
      const firstRowBody = container.querySelector("tbody")
        ?.firstElementChild as HTMLTableRowElement;
      const firstRowBodyMenu = within(firstRowBody).getByRole("button", {
        name: /open menu/i,
      });

      const getDeleteOption = () =>
        screen.getByRole("menuitem", {
          name: /delete/i,
        });

      const getCancelBtn = () =>
        screen.getByRole("button", {
          name: /cancel/i,
        });

      const getConfirmBtn = () =>
        screen.getByRole("button", {
          name: /confirm/i,
        });

      // Cancel
      await user.click(firstRowBodyMenu);
      await user.click(getDeleteOption());
      await user.click(getCancelBtn());

      expect(deleteMethod).not.toHaveBeenCalled();

      // Confirm
      await user.click(getDeleteOption());
      await user.click(getConfirmBtn());

      expect(deleteMethod).toHaveBeenCalled();
    });
  });

  describe("Add Data", () => {
    test("Text & Link Component", () => {
      const addDataBtn = screen.getByRole("link", {
        name: /add brief/i,
      }) as HTMLLinkElement;

      expect(addDataBtn.textContent).toBe(ADD_DATA.text);
      expect(addDataBtn.href).toContain(ADD_DATA.link);
    });
  });
});
