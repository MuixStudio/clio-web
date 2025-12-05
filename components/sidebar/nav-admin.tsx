"use client";

import Link from "next/link";
import * as React from "react";
import { ShieldUser } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavAdmin({}: {}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="border" tooltip="admin">
          <Link href="/admin">
            <ShieldUser />
            <span>admin</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
