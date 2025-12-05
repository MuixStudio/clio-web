"use client";

import type { Tenant } from "@/components/sidebar/sidebar";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

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
import { useTenantContext } from "@/contexts/tenant-context";

type Props = {
  tenants: Tenant[];
  /** 受控模式：当前选中的租户ID */
  value?: string;
  /** 非受控模式：默认选中的租户ID */
  defaultValue?: string;
  /** 值改变时的回调函数，返回完整的租户对象 */
  onChange?: (tenant: Tenant) => void;
  /** 是否处于加载状态 */
  isLoading?: boolean;
};

export const TenantSwitcher: React.FC<Props> = ({
  tenants,
  value,
  defaultValue,
  onChange,
  isLoading = false,
}: {
  tenants: Tenant[];
  value?: string;
  defaultValue?: string;
  onChange?: (tenant: Tenant) => void;
  isLoading?: boolean;
}) => {
  const { isMobile } = useSidebar();
  const { currentTenantId, setCurrentTenantId } = useTenantContext();

  // 内部状态用于非受控模式
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );

  // 判断是否为受控组件
  const isControlled = value !== undefined;

  // 获取当前值：受控模式使用 value，非受控模式使用内部状态，否则使用 context
  const currentValue = React.useMemo(() => {
    if (isControlled) {
      return value;
    }
    if (internalValue !== undefined) {
      return internalValue;
    }

    return currentTenantId;
  }, [isControlled, value, internalValue, currentTenantId]);

  // 根据当前租户ID找到激活的团队
  const activeTeam = React.useMemo(
    () =>
      tenants.find((tenant) => tenant.tenant_id === currentValue) || tenants[0],
    [tenants, currentValue],
  );

  // 处理团队切换
  const handleTeamChange = React.useCallback(
    (tenant: Tenant) => {
      const newValue = tenant.tenant_id;

      // 如果是非受控模式，更新内部状态
      if (!isControlled) {
        setInternalValue(newValue);
      }

      // 调用外部 onChange 回调，传递完整的租户对象
      onChange?.(tenant);

      // 如果没有传入 value/defaultValue/onChange，使用 context（保持向后兼容）
      if (value === undefined && defaultValue === undefined && !onChange) {
        setCurrentTenantId(newValue);
      }
    },
    [isControlled, onChange, value, defaultValue, setCurrentTenantId],
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

  if (!activeTeam) {
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
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
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
              Teams
            </DropdownMenuLabel>
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.tenant_id}
                className="gap-2 p-2"
                onClick={() => handleTeamChange(tenant)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <tenant.logo className="size-4 shrink-0" />
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
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
