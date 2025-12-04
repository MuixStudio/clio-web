"use client";

import type { Tenant } from "@/components/sidebar/sidebar";

import useSWR from "swr";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

/**
 * 团队API响应类型
 */
interface TeamResponse {
  id: string;
  name: string;
  plan: string;
  logo?: string;
}

/**
 * 从API获取团队的fetcher函数
 */
const fetchTeams = async (): Promise<TeamResponse[]> => {
  // TODO: 替换为实际的API调用
  // const response = await get<{ data: TeamResponse[] }>("/teams");
  // return response.data;

  // 模拟API响应
  return Promise.resolve([
    { id: "1", name: "Acme Inc", plan: "Enterprise", logo: "gallery" },
    { id: "2", name: "Acme Corp.", plan: "Startup", logo: "audio" },
    { id: "3", name: "Evil Corp.", plan: "Free", logo: "command" },
  ]);
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
 * 自定义钩子：从API获取团队列表
 *
 * @returns {{ teams: Tenant[]; isLoading: boolean; error: any }}
 */
export function useTenant() {
  const { data, error, isLoading } = useSWR<TeamResponse[]>(
    "/tenants",
    fetchTeams,
    {
      // 配置选项
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // 转换API数据为侧边栏团队格式
  const tenants: Tenant[] = (data || []).map((tenant) => ({
    tenant_id: tenant.id,
    name: tenant.name,
    logo: logoMap[tenant.logo || "gallery"] || GalleryVerticalEnd,
    plan: tenant.plan,
  }));

  return {
    tenants,
    isLoading,
    error,
  };
}
