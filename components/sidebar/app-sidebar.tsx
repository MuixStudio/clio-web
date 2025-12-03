"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
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
import { useNavItems } from "@/hooks/use-nav-items";
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";
import { getUserInfo } from "@/service/user";
import { Tenant } from "@/components/sidebar/sidebar";

export const AppSidebar: React.FC = ({
  ...props
}: React.ComponentProps<typeof AppSidebar>) => {
  const pathname = usePathname();

  // 获取用户信息
  const { data: userInfo, isLoading: userLoading } = useSWR(
    "/userinfo",
    getUserInfo,
  );

  // 根据用户角色获取导航菜单
  const baseNavItems = useNavItems(userInfo?.role);

  // 根据当前路径设置菜单激活状态
  const navItems = React.useMemo(() => {
    return baseNavItems.map((item) => ({
      ...item,
      isActive: pathname.startsWith(item.url),
    }));
  }, [baseNavItems, pathname]);

  // 获取项目列表
  const { projects, isLoading: projectsLoading } = useProjects();

  // 获取团队列表
  const { teams, isLoading: teamsLoading } = useTeams();

  // 任何数据还在加载中，显示骨架屏
  if (projectsLoading || teamsLoading) {
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
        <TenantSwitcher tenants={teams} onChange={tenantChanged} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userInfo?.name || "Guest",
            email: userInfo?.email || "",
            avatar: userInfo?.avatar || "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
