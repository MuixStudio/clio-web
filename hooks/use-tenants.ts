"use client";

import type { Tenant } from "@/components/sidebar/sidebar";

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import { useTenantContext } from "@/contexts/tenant-context";

/**
 * 租户API响应类型
 */
export interface TenantResponse {
  id: string;
  name: string;
  plan: string;
  logo?: string;
}

/**
 * 从API获取租户的fetcher函数
 */
const fetchTenants = async (): Promise<TenantResponse[]> => {
  // TODO: 替换为实际的API调用
  // const response = await get<TenantResponse[]>("/api/v1/tenants");
  // return response;

  // 模拟API响应（模拟网络延迟）
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { id: "tenant-1", name: "Acme Inc", plan: "Enterprise", logo: "gallery" },
    { id: "tenant-2", name: "Acme Corp.", plan: "Startup", logo: "audio" },
    { id: "tenant-3", name: "Evil Corp.", plan: "Free", logo: "command" },
  ];
};

/**
 * Logo图标映射
 */
const logoMap: Record<string, any> = {
  gallery: GalleryVerticalEnd,
  audio: AudioWaveform,
  command: Command,
};

/**
 * 自定义钩子：从API获取租户列表
 * 自动初始化第一个租户作为当前租户
 *
 * @returns {{ tenants: Tenant[]; isLoading: boolean; error: any }}
 */
export function useTenants() {
  const { currentTenantId, setCurrentTenantId } = useTenantContext();

  const { data, error, isLoading } = useSWR<TenantResponse[]>(
    "/api/v1/tenants",
    fetchTenants,
    {
      // 配置选项
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // 只在初始时获取一次
      revalidateIfStale: false,
    },
  );

  // 使用 useMemo 缓存转换后的租户数据，避免不必要的重新计算
  const tenants: Tenant[] = useMemo(() => {
    return (data || []).map((tenant) => ({
      tenant_id: tenant.id,
      name: tenant.name,
      logo: logoMap[tenant.logo || "gallery"] || GalleryVerticalEnd,
      plan: tenant.plan,
    }));
  }, [data]);

  // 自动初始化第一个租户（如果没有设置当前租户且租户列表已加载）
  useEffect(() => {
    if (!currentTenantId && tenants.length > 0) {
      setCurrentTenantId(tenants[0].tenant_id);
    }
  }, [currentTenantId, tenants, setCurrentTenantId]);

  return {
    tenants,
    isLoading,
    error,
  };
}
