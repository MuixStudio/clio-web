"use client";

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

/**
 * 单个导航菜单项组件
 */
function NavMainItem({ item }: { item: NavItem }) {
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
              <NavMainSubItem key={subItem.title} subItem={subItem} />
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
function NavMainSubItem({
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

export function NavMain({ menu }: { menu: Menu }) {
  return (
    <>
      {menu.navGroups.map((navGroup) => (
        <SidebarGroup key={navGroup.name}>
          <SidebarGroupLabel>{navGroup.name}</SidebarGroupLabel>
          <SidebarMenu>
            {navGroup.items.map((navItem) => (
              <NavMainItem key={navItem.title} item={navItem} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
