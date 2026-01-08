import type { LucideIcon } from "lucide-react";

import React from "react";

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
    /** 菜单图标（Lucide图标组件） */
    icon?: LucideIcon;
  }[];
}

export interface NavGroup {
  items: NavItem[];
}

export interface Menu {
  header?: MenuHeader;
  footer?: MenuFooter;
  navGroups: NavGroup[];
}

export interface MenuHeader {
  title: string;
  element?: React.ReactNode;
}

export interface MenuFooter {
  element?: React.ReactNode;
}
