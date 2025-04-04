"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import withAuth from "@/utils/with-auth";

function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    setUserId(storedUser);
  }, []);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {userId ? (
                <DataTable userId={userId} />  
              ) : (
                <p>Loading...</p>
              )}
              
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default withAuth(Page)
