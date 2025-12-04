"use client";

import { useMemo } from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { Menu } from "@/components/sidebar/sidebar";

/**
 * 自定义钩子：根据用户权限动态生成导航菜单
 *
 * @param userRole - 用户角色（可选）
 * @returns {NavItem[]} 导航菜单项列表
 */
export function useNavItems(userRole?: string): Menu {
  return useMemo(() => {
    const baseItems: Menu = {
      navGroups: [
        {
          name: "platform",
          items: [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: SquareTerminal,
              items: [
                {
                  title: "Overview",
                  url: "/dashboard/overview",
                },
                {
                  title: "Analytics",
                  url: "/dashboard/analytics",
                },
                {
                  title: "Reports",
                  url: "/dashboard/reports",
                },
              ],
            },
            {
              title: "Models",
              url: "/settinga",
              icon: Bot,
              items: [
                {
                  title: "Genesis",
                  url: "/models/genesis",
                },
                {
                  title: "Explorer",
                  url: "/models/explorer",
                },
                {
                  title: "Quantum",
                  url: "/models/quantum",
                },
              ],
            },
            {
              title: "Documentation",
              url: "/docs",
              icon: BookOpen,
              items: [
                {
                  title: "Introduction",
                  url: "/docs/introduction",
                },
                {
                  title: "Get Started",
                  url: "/docs/get-started",
                },
                {
                  title: "Tutorials",
                  url: "/docs/tutorials",
                },
                {
                  title: "Changelog",
                  url: "/docs/changelog",
                },
              ],
            },
            {
              title: "Settings",
              url: "/settings/sessions",
              icon: BookOpen,
            },
          ],
        },
      ],
    };

    // // 根据用户角色添加额外的菜单项
    // if (userRole === "admin" || userRole === "owner") {
    //   baseItems.push({
    //     title: "Settings",
    //     url: "/settings",
    //     icon: Settings2,
    //     items: [
    //       {
    //         title: "个人资料",
    //         url: "/settings/profile",
    //       },
    //       {
    //         title: "账户安全",
    //         url: "/settings/account",
    //       },
    //       {
    //         title: "外观设置",
    //         url: "/settings/appearance",
    //       },
    //       {
    //         title: "会话管理",
    //         url: "/settings/sessions",
    //       },
    //       {
    //         title: "API 令牌",
    //         url: "/settings/tokens",
    //       },
    //     ],
    //   });
    // }

    return baseItems;
  }, [userRole]);
}
