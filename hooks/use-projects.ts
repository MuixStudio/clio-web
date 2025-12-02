"use client";

import useSWR from "swr";
import { Frame, PieChart, Map } from "lucide-react";

import type { Project } from "@/components/sidebar/sidebar";

/**
 * 项目API响应类型
 */
interface ProjectResponse {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

/**
 * 从API获取项目的fetcher函数
 */
const fetchProjects = async (): Promise<ProjectResponse[]> => {
  // TODO: 替换为实际的API调用
  // const response = await get<{ data: ProjectResponse[] }>("/projects");
  // return response.data;

  // 模拟API响应
  return Promise.resolve([
    {
      id: "1",
      name: "Design Engineering",
      url: "/projects/design",
      icon: "frame",
    },
    {
      id: "2",
      name: "Sales & Marketing",
      url: "/projects/sales",
      icon: "chart",
    },
    { id: "3", name: "Travel", url: "/projects/travel", icon: "map" },
  ]);
};

/**
 * 图标映射
 */
const iconMap: Record<string, any> = {
  frame: Frame,
  chart: PieChart,
  map: Map,
};

/**
 * 自定义钩子：从API获取项目列表
 *
 * @returns {{ projects: Project[]; isLoading: boolean; error: any }}
 */
export function useProjects() {
  const { data, error, isLoading } = useSWR<ProjectResponse[]>(
    "/projects",
    fetchProjects,
    {
      // 配置选项
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // 转换API数据为侧边栏项目格式
  const projects: Project[] = (data || []).map((project) => ({
    name: project.name,
    url: project.url,
    icon: iconMap[project.icon || "frame"] || Frame,
  }));

  return {
    projects,
    isLoading,
    error,
  };
}
