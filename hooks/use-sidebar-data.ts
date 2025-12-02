"use client";

import { useMemo } from "react";

import type { SidebarData } from "@/components/sidebar/sidebar";
import { useTenants } from "./use-tenants";
import { useTenantUserinfo } from "./use-tenant-userinfo";
import { useTenantMenus } from "./use-tenant-menus";

/**
 * 侧边栏数据加载状态
 */
export interface SidebarDataState {
  /** 侧边栏数据（加载中时为 null） */
  data: SidebarData | null;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 租户是否已加载 */
  tenantsLoaded: boolean;
}

/**
 * 自定义钩子：获取侧边栏数据
 * 集成租户、用户信息、菜单等数据
 *
 * 数据流程：
 * 1. 先获取所有租户（/api/v1/tenants）
 * 2. 选择第一个租户作为当前租户（或从 localStorage 恢复）
 * 3. 根据当前租户获取用户信息（/api/v1/userinfo）
 * 4. 根据当前租户获取菜单（/api/v1/menus）
 *
 * @returns {SidebarDataState} 侧边栏数据状态
 */
export function useSidebarData(): SidebarDataState {
  // 1. 获取所有租户（第一步，最重要）
  const {
    tenants,
    isLoading: tenantsLoading,
    error: tenantsError,
  } = useTenants();

  // 2. 根据当前租户获取用户信息（条件请求：租户加载完成后才请求）
  const {
    user,
    isLoading: userinfoLoading,
    error: userinfoError,
  } = useTenantUserinfo();

  // 3. 根据当前租户获取菜单（条件请求：租户加载完成后才请求）
  const {
    navMain,
    projects,
    isLoading: menusLoading,
    error: menusError,
  } = useTenantMenus();

  // 租户是否已加载完成
  const tenantsLoaded = !tenantsLoading && tenants.length > 0;

  // 整体加载状态：租户加载中 OR (租户已加载 AND (用户信息或菜单加载中))
  const isLoading =
    tenantsLoading || (tenantsLoaded && (userinfoLoading || menusLoading));

  // 使用 useMemo 缓存侧边栏数据，避免不必要的重新计算
  const sidebarData = useMemo<SidebarData | null>(() => {
    // 如果数据还在加载中，返回 null（显示骨架屏）
    if (isLoading) {
      return null;
    }

    // 如果有任何错误，也返回 null
    if (tenantsError || userinfoError || menusError) {
      console.error("Sidebar data loading error:", {
        tenantsError,
        userinfoError,
        menusError,
      });
      return null;
    }

    // 如果必要数据不存在，返回 null
    if (!user || tenants.length === 0) {
      return null;
    }

    // 构建完整的侧边栏数据
    return {
      user,
      tenants: tenants,
      navMain,
      projects,
    };
  }, [
    isLoading,
    tenantsError,
    userinfoError,
    menusError,
    user,
    tenants,
    navMain,
    projects,
  ]);

  return {
    data: sidebarData,
    isLoading,
    tenantsLoaded,
  };
}
