"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useIsActive, useActivePath } from "@/hooks/use-active-item";
import { Menu, NavItem } from "@/components/sidebar/sidebar";

type MenuContextProps = {
  menu?: Menu;
  setMenu: (menu: Menu | undefined, layoutDepth?: number) => void;
};

const MenuContext = React.createContext<MenuContextProps | null>(null);

function getRouteDegth(path: string): number {
  return path.split("/").filter(Boolean).length;
}

export function useMenu() {
  const context = React.useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider.");
  }

  return context;
}

export function MenuProvider({
  menu: initialMenu,
  children,
}: {
  menu?: Menu;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menu, setMenuState] = React.useState<Menu | undefined>(initialMenu);
  const maxDepthRef = React.useRef<number>(-1);
  const pendingMenuRef = React.useRef<Map<number, Menu | undefined>>(new Map());

  const setMenu = React.useCallback(
    (newMenu: Menu | undefined, layoutDepth?: number) => {
      // 如果没有指定 layoutDepth，则计算路由深度
      const currentDepth = layoutDepth ?? getRouteDegth(pathname);

      // 记录当前深度的菜单更新
      pendingMenuRef.current.set(currentDepth, newMenu);

      // 找出最深的深度
      const maxDepth = Math.max(...Array.from(pendingMenuRef.current.keys()));

      // 只有最深的菜单才会被应用
      if (currentDepth === maxDepth) {
        setMenuState(newMenu);
        maxDepthRef.current = currentDepth;
        // 清空比当前深度浅的记录
        Array.from(pendingMenuRef.current.keys()).forEach((depth) => {
          if (depth < currentDepth) {
            pendingMenuRef.current.delete(depth);
          }
        });
      }
    },
    [pathname],
  );

  const contextValue = React.useMemo<MenuContextProps>(
    () => ({
      menu,
      setMenu,
    }),
    [menu, setMenu],
  );

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
}

/**
 * 单个导航菜单项组件
 */
function MenuItem({ item }: { item: NavItem }) {
  useMenu();
  // 检查当前菜单项是否激活
  const isItemActive = useIsActive(item.url);
  const pathname = useActivePath();

  // 如果没有子项，返回简单的菜单项
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isItemActive} tooltip={item.title}>
          <Link href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // 检查是否有激活的子项

  const hasActiveChild = item.items?.some((subItem) =>
    pathname.startsWith(subItem.url),
  );

  // 决定是否应该展开
  const shouldOpen = item.isActive || isItemActive || hasActiveChild;

  return (
    <Collapsible asChild className="group/collapsible" defaultOpen={shouldOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={isItemActive} tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <MenuSubItem key={subItem.title} subItem={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * 子菜单项组件
 */
function MenuSubItem({
  subItem,
}: {
  subItem: {
    title: string;
    url: string;
  };
}) {
  const isActive = useIsActive(subItem.url);

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link href={subItem.url}>
          <span>{subItem.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function NavMain({ menu: overrideMenu }: { menu?: Menu } = {}) {
  const { menu: contextMenu } = useMenu();
  const menu = overrideMenu || contextMenu;

  if (!menu) {
    return null;
  }

  return (
    <>
      {menu.navGroups.map((navGroup) => (
        <SidebarGroup key={navGroup.name}>
          <SidebarGroupLabel>{navGroup.name}</SidebarGroupLabel>
          <SidebarMenu>
            {navGroup.items.map((navItem) => (
              <MenuItem key={navItem.title} item={navItem} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
