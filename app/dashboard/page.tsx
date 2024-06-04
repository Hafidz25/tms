import CardDashboard from "@/components/custom/CardDashboard";
import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <CardDashboard />
    </div>
  );
}
