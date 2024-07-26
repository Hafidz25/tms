import { DataTable } from "./data-table";
import { columns } from "./columns";

type BriefsTableProps = Omit<
  React.ComponentProps<typeof DataTable>,
  "data" | "columns"
> & {
  data: any;
};

export function PayslipsTable({ data, ...props }: BriefsTableProps) {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-4 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Data Payslips</h2>
      </div>
      <DataTable data={data} columns={columns} {...props} />
    </div>
  );
}
