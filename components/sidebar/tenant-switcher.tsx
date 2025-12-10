"use client";

import * as React from "react";
import { ChevronsUpDown, LucideIcon, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 租户信息类型
 */
export interface Tenant {
  /** 租户ID */
  tenant_id: string;
  /** 租户名称 */
  name: string;
  /** 租户Logo（Lucide图标组件） */
  logo_url: LucideIcon;
  /** 租户计划类型 */
  plan_type: string;
}

type Props = {
  /** 租户列表 */
  tenants: Tenant[];
  /** 当前选中的租户ID */
  currentTenantId: string;
  /** 租户切换时的回调函数，返回完整的租户对象 */
  onChange: (tenant: Tenant) => void;
  /** 是否处于加载状态 */
  isLoading?: boolean;
};

export const TenantSwitcher: React.FC<Props> = ({
  tenants,
  currentTenantId,
  onChange,
  isLoading = false,
}: Props) => {
  const { isMobile } = useSidebar();

  // 根据当前租户ID找到激活的租户
  const activeTenant = React.useMemo(
    () =>
      tenants.find((tenant) => tenant.tenant_id === currentTenantId) ||
      tenants[0],
    [tenants, currentTenantId],
  );
  // 处理租户切换
  const handleTenantChange = React.useCallback(
    (tenant: Tenant) => {
      onChange(tenant);
    },
    [onChange],
  );

  // 加载状态时显示骨架屏
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="h-16" size="lg">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTenant) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-border border"
              size="lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTenant.logo_url className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTenant.name}
                </span>
                <span className="truncate text-xs">
                  {activeTenant.plan_type}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Tenants
            </DropdownMenuLabel>
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.tenant_id}
                className="gap-2 p-2"
                onClick={() => handleTenantChange(tenant)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <tenant.logo_url className="size-4 shrink-0" />
                </div>
                {tenant.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add tenant
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
