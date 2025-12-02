"use client";

import { useMemo } from "react";
import useSWR from "swr";
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { NavItem, Project } from "@/components/sidebar/sidebar";
import { useTenantContext } from "@/contexts/tenant-context";

/**
 * 菜单项API响应类型
 */
interface MenuItemResponse {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

/**
 * 项目API响应类型
 */
interface ProjectResponse {
  name: string;
  url: string;
  icon?: string;
}

/**
 * 菜单API响应类型
 */
interface MenusResponse {
  navMain: MenuItemResponse[];
  projects: ProjectResponse[];
}

/**
 * 图标映射
 */
const iconMap: Record<string, LucideIcon> = {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  Frame,
  PieChart,
  Map,
};

/**
 * 从API获取菜单的fetcher函数
 * @param tenantId 租户ID
 */
const fetchMenus = async (tenantId: string): Promise<MenusResponse> => {
  // TODO: 替换为实际的API调用
  // const response = await get<MenusResponse>(`/api/v1/menus?tenantId=${tenantId}`);
  // return response;

  // 模拟API响应（模拟网络延迟）
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 根据租户返回不同的菜单
  const menusMap: Record<string, MenusResponse> = {
    "tenant-1": {
      navMain: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: "SquareTerminal",
          isActive: true,
          items: [
            { title: "Overview", url: "/dashboard/overview" },
            { title: "Analytics", url: "/dashboard/analytics" },
          ],
        },
        {
          title: "AI Models",
          url: "/models",
          icon: "Bot",
          items: [
            { title: "GPT-4", url: "/models/gpt4" },
            { title: "Claude", url: "/models/claude" },
          ],
        },
        {
          title: "Settings",
          url: "/settings",
          icon: "Settings2",
          items: [
            { title: "Profile", url: "/settings/profile" },
            { title: "Billing", url: "/settings/billing" },
          ],
        },
      ],
      projects: [
        { name: "Project Alpha", url: "/projects/alpha", icon: "Frame" },
        { name: "Project Beta", url: "/projects/beta", icon: "PieChart" },
      ],
    },
    "tenant-2": {
      navMain: [
        {
          title: "Playground",
          url: "/playground",
          icon: "SquareTerminal",
          isActive: true,
        },
        {
          title: "Documentation",
          url: "/docs",
          icon: "BookOpen",
          items: [
            { title: "Getting Started", url: "/docs/start" },
            { title: "API Reference", url: "/docs/api" },
          ],
        },
      ],
      projects: [
        { name: "Marketing Site", url: "/projects/marketing", icon: "Map" },
      ],
    },
    "tenant-3": {
      navMain: [
        {
          title: "Control Panel",
          url: "/control",
          icon: "SquareTerminal",
          isActive: true,
        },
        {
          title: "Evil Plans",
          url: "/plans",
          icon: "Bot",
        },
      ],
      projects: [
        { name: "World Domination", url: "/projects/domination", icon: "Map" },
      ],
    },
  };

  return (
    menusMap[tenantId] || {
      navMain: [],
      projects: [],
    }
  );
};

/**
 * 自定义钩子：根据当前租户获取菜单
 * 只有在租户ID存在时才会发起请求
 *
 * @returns {{ navMain: NavItem[]; projects: Project[]; isLoading: boolean; error: any }}
 */
export function useTenantMenus() {
  const { currentTenantId } = useTenantContext();

  // 使用条件请求：只有当 currentTenantId 存在时才请求
  const { data, error, isLoading } = useSWR<MenusResponse>(
    currentTenantId ? ["/api/v1/menus", currentTenantId] : null,
    () => fetchMenus(currentTenantId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // 使用 useMemo 缓存转换后的菜单数据
  const navMain: NavItem[] = useMemo(() => {
    if (!data?.navMain) return [];

    return data.navMain.map((item) => ({
      title: item.title,
      url: item.url,
      icon: item.icon ? iconMap[item.icon] : undefined,
      isActive: item.isActive,
      items: item.items,
    }));
  }, [data]);

  const projects: Project[] = useMemo(() => {
    if (!data?.projects) return [];

    return data.projects.map((project) => ({
      name: project.name,
      url: project.url,
      icon: project.icon ? iconMap[project.icon] : Frame,
    }));
  }, [data]);

  return {
    navMain,
    projects,
    isLoading,
    error,
  };
}
