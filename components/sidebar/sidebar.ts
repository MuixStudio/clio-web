import type { LucideIcon } from "lucide-react";

/**
 * 侧边栏导航菜单项类型
 */
export interface NavItem {
  /** 菜单标题 */
  title: string;
  /** 菜单链接 */
  url: string;
  /** 菜单图标（Lucide图标组件） */
  icon?: LucideIcon;
  /** 是否为当前激活项 */
  isActive?: boolean;
  /** 子菜单项 */
  items?: {
    title: string;
    url: string;
  }[];
}

/**
 * 侧边栏项目类型
 */
export interface Project {
  /** 项目名称 */
  name: string;
  /** 项目链接 */
  url: string;
  /** 项目图标 */
  icon: LucideIcon;
}

/**
 * 侧边栏用户信息类型
 */
export interface SidebarUser {
  /** 用户名 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 用户头像URL */
  avatar: string;
}

/**
 * 租户信息类型
 */
export interface Tenant {
  /** 租户ID */
  tenant_id: string;
  /** 租户名称 */
  name: string;
  /** 租户Logo（Lucide图标组件） */
  logo: LucideIcon;
  /** 租户计划类型 */
  plan: string;
}

/**
 * 侧边栏完整数据类型
 */
export interface SidebarData {
  /** 用户信息 */
  user: SidebarUser;
  /** 团队列表 */
  tenants: Tenant[];
  /** 主导航菜单 */
  navMain: NavItem[];
  /** 项目列表 */
  projects: Project[];
}
