"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

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
import { Tenant } from "@/components/sidebar/tenant-switcher";
import { NavAdmin } from "@/components/sidebar/nav-admin";
import { useTenantContext } from "@/contexts/tenant-context";
import { useAppContext } from "@/contexts/app-context";

export const AppSidebar: React.FC = ({
  ...props
}: React.ComponentProps<typeof AppSidebar>) => {
  const router = useRouter();
  const { setCurrentTenantId } = useTenantContext();

  const {
    userInfo,
    isLoadingUserInfo,
    mutateUserInfo,
    tenants,
    isLoadingTenants,
    mutateTenants,
    currentTenant,
  } = useAppContext();

  // 将 API 返回的租户数据转换为 TenantSwitcher 需要的格式
  const formattedTenants: Tenant[] = React.useMemo(() => {
    if (!tenants || tenants.length === 0) {
      return [];
    }

    return tenants.map((tenant) => ({
      tenant_id: tenant.tenant_id,
      name: tenant.name,
      logo_url: Building2,
      plan_type: tenant.plan_type,
    }));
  }, [tenants]);

  // 任何数据还在加载中，显示骨架屏
  if (isLoadingUserInfo || isLoadingTenants) {
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
    // 更新租户上下文
    setCurrentTenantId(tenant.tenant_id);

    // 刷新用户信息和团队数据
    mutateUserInfo();
    mutateTenants();

    // 跳转到首页
    router.push("/");
  };

  return (
    <Sidebar className="relative" collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher
          currentTenantId={currentTenant.tenant_id}
          tenants={formattedTenants}
          onChange={tenantChanged}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin />
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
