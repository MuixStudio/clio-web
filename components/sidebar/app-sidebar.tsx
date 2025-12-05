"use client";

import * as React from "react";
import useSWR from "swr";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TenantSwitcher } from "@/components/sidebar/tenant-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenant } from "@/hooks/use-tenant";
import { getUserInfo } from "@/service/user";
import { Tenant } from "@/components/sidebar/sidebar";
import {NavAdmin} from "@/components/sidebar/nav-admin";

export const AppSidebar: React.FC = ({
  ...props
}: React.ComponentProps<typeof AppSidebar>) => {
  // 获取用户信息
  const { data: userInfo, isLoading: userLoading } = useSWR(
    "/userinfo",
    getUserInfo,
  );

  // 获取团队列表
  const { tenants, isLoading: teamsLoading } = useTenant();

  // 任何数据还在加载中，显示骨架屏
  if (userLoading || teamsLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Skeleton className="h-12 w-full" />
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-2 p-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className="h-12 w-full" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  const tenantChanged = (tenant: Tenant) => {
    console.log(tenant);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher tenants={tenants} onChange={tenantChanged} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin/>
      </SidebarFooter>
      <SidebarFooter className="border-t border-border dark:border-border-dark">
        <NavUser
          user={{
            name: userInfo?.name || undefined,
            email: userInfo?.email || undefined,
            avatar: userInfo?.avatar_url || undefined,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
