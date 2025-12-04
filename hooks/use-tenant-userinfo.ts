"use client";

import type { SidebarUser } from "@/components/sidebar/sidebar";

import { useMemo } from "react";
import useSWR from "swr";

import { useTenantContext } from "@/contexts/tenant-context";

/**
 * 用户信息API响应类型
 */
export interface UserinfoResponse {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * 从API获取用户信息的fetcher函数
 * @param tenantId 租户ID
 */
const fetchUserinfo = async (tenantId: string): Promise<UserinfoResponse> => {
  // TODO: 替换为实际的API调用
  // const response = await get<UserinfoResponse>(`/api/v1/userinfo?tenantId=${tenantId}`);
  // return response;

  // 模拟API响应（模拟网络延迟）
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 根据租户返回不同的用户信息
  const userMap: Record<string, UserinfoResponse> = {
    "tenant-1": {
      name: "John Doe",
      email: "john@acme-inc.com",
      avatar: "/avatars/john.jpg",
    },
    "tenant-2": {
      name: "Jane Smith",
      email: "jane@acme-corp.com",
      avatar: "/avatars/jane.jpg",
    },
    "tenant-3": {
      name: "Evil Admin",
      email: "admin@evil-corp.com",
      avatar: "/avatars/evil.jpg",
    },
  };

  return (
    userMap[tenantId] || {
      name: "Guest User",
      email: "guest@example.com",
      avatar: "/avatars/default.jpg",
    }
  );
};

/**
 * 自定义钩子：根据当前租户获取用户信息
 * 只有在租户ID存在时才会发起请求
 *
 * @returns {{ user: SidebarUser | null; isLoading: boolean; error: any }}
 */
export function useTenantUserinfo() {
  const { currentTenantId } = useTenantContext();

  // 使用条件请求：只有当 currentTenantId 存在时才请求
  const { data, error, isLoading } = useSWR<UserinfoResponse>(
    currentTenantId ? ["/api/v1/userinfo", currentTenantId] : null,
    () => fetchUserinfo(currentTenantId!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // 使用 useMemo 缓存转换后的用户数据
  const user: SidebarUser | null = useMemo(() => {
    if (!data) return null;

    return {
      name: data.name,
      email: data.email,
      avatar: data.avatar || "/avatars/default.jpg",
    };
  }, [data]);

  return {
    user,
    isLoading,
    error,
  };
}
