Implementasi : 

```tsx

"use client";

import { createBriefs } from "@/data/briefs";
import { DashboardPanel } from "@/components/layouts/dashboard-panel";
import { BriefsTable } from "@/components/data-grid/briefs";

// Implementasi fetch data
const data = createBriefs({amount: 100});

export default function DebugPage() {
  return (
    <DashboardPanel>
      <BriefsTable data={data}/>
    </DashboardPanel>
  );
}

```