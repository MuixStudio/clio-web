# 侧边栏菜单选中状态指南

## 功能概述

侧边栏现在支持自动跟踪和高亮显示当前激活的菜单项。当你点击某个菜单项后，该菜单项会自动变为选中状态的颜色。

## 核心特性

### 1. 自动路由跟踪
- 基于 Next.js 的 `usePathname()` hook
- 自动检测当前页面路径
- 无需手动管理状态

### 2. 智能匹配逻辑
- **前缀匹配**：默认模式，适用于嵌套路由
  - 例如：访问 `/dashboard/analytics` 时，`/dashboard` 菜单项也会被激活
- **精确匹配**：可选模式，只在路径完全相同时激活

### 3. 子菜单支持
- 子菜单项被激活时，父菜单会自动展开
- 子菜单项独立显示激活状态
- 支持多级嵌套

### 4. 视觉反馈
- 激活的菜单项有特殊的背景色和文字颜色
- 使用 shadcn/ui 的 `isActive` 属性
- 平滑的过渡动画

## 使用方法

### 基础使用

菜单组件已经自动集成了选中状态跟踪，无需额外配置：

```tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
```

### 自定义激活状态检测

如果需要自定义激活状态逻辑，使用 `useIsActive` hook：

```tsx
import { useIsActive } from "@/hooks/use-active-item";

export function MyMenuItem({ url }) {
  // 前缀匹配（默认）
  const isActive = useIsActive(url);

  // 或精确匹配
  const isExactActive = useIsActive(url, true);

  return (
    <SidebarMenuButton isActive={isActive}>
      My Menu Item
    </SidebarMenuButton>
  );
}
```

## 工作原理

### 1. URL 配置

确保菜单项的 URL 配置正确：

```typescript
// hooks/use-nav-items.ts
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",  // 父菜单 URL
    icon: SquareTerminal,
    items: [
      {
        title: "Overview",
        url: "/dashboard/overview",  // 子菜单 URL（包含父路径）
      },
    ],
  },
];
```

### 2. 激活检测流程

```
当前路径: /dashboard/overview

检测过程:
1. 检查 "/dashboard" → 匹配 ✅（前缀匹配）
2. 检查 "/dashboard/overview" → 匹配 ✅（精确匹配）

结果:
- Dashboard 父菜单：激活 ✅
- Overview 子菜单：激活 ✅
- Dashboard 折叠面板：自动展开 ✅
```

### 3. 组件实现

**NavMain 组件**（主导航菜单）：

```tsx
// components/sidebar/nav-main.tsx
export function NavMain({ items }) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        // 检查父菜单是否激活
        const isItemActive = useIsActive(item.url);

        // 检查是否有激活的子菜单
        const hasActiveChild = item.items?.some((subItem) =>
          useIsActive(subItem.url)
        );

        // 如果父菜单或子菜单激活，则展开
        const shouldOpen = isItemActive || hasActiveChild;

        return (
          <Collapsible defaultOpen={shouldOpen}>
            <SidebarMenuButton isActive={isItemActive}>
              {item.title}
            </SidebarMenuButton>

            {item.items?.map((subItem) => {
              const isSubItemActive = useIsActive(subItem.url);

              return (
                <SidebarMenuSubButton isActive={isSubItemActive}>
                  <Link href={subItem.url}>
                    {subItem.title}
                  </Link>
                </SidebarMenuSubButton>
              );
            })}
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
```

**NavProjects 组件**（项目列表）：

```tsx
// components/sidebar/nav-projects.tsx
export function NavProjects({ projects }) {
  return (
    <SidebarMenu>
      {projects.map((item) => {
        const isActive = useIsActive(item.url);

        return (
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.url}>
                {item.name}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
```

## 样式自定义

shadcn/ui 的 `SidebarMenuButton` 组件在 `isActive` 为 true 时会自动应用以下样式：

```css
/* 来自 components/ui/sidebar.tsx */
data-[active=true]:bg-sidebar-accent
data-[active=true]:text-sidebar-accent-foreground
```

如果需要自定义激活状态的样式，可以在组件中添加额外的 className：

```tsx
<SidebarMenuButton
  isActive={isActive}
  className={cn(
    "your-custom-classes",
    isActive && "your-active-classes"
  )}
>
  Menu Item
</SidebarMenuButton>
```

## 常见场景

### 场景 1：嵌套路由

```
路由结构:
/dashboard
  /dashboard/overview
  /dashboard/analytics
    /dashboard/analytics/users
    /dashboard/analytics/events

当访问 /dashboard/analytics/users 时:
- ✅ Dashboard 菜单激活
- ✅ Analytics 子菜单激活
- ✅ Dashboard 折叠面板展开
```

### 场景 2：独立路由

```
路由结构:
/projects/design
/projects/marketing
/projects/travel

当访问 /projects/design 时:
- ✅ Design 项目激活
- ❌ Marketing 项目未激活
- ❌ Travel 项目未激活
```

### 场景 3：首页特殊处理

```tsx
// 对于根路径 "/" 需要精确匹配
const isHomeActive = useIsActive("/", true);
```

## API 参考

### `useIsActive(itemUrl, exact?)`

**参数**：
- `itemUrl: string` - 菜单项的 URL
- `exact?: boolean` - 是否使用精确匹配（默认 false）

**返回**：
- `boolean` - 菜单项是否激活

**示例**：
```tsx
const isActive = useIsActive("/dashboard");        // 前缀匹配
const isExact = useIsActive("/dashboard", true);   // 精确匹配
```

### `useActivePath()`

**返回**：
- `string` - 当前路由路径

**示例**：
```tsx
const pathname = useActivePath();  // 返回 "/dashboard/overview"
```

## 故障排查

### 问题：菜单项一直不激活

**可能原因**：
1. URL 配置不匹配当前路径
2. 使用了 `<a>` 标签而不是 `<Link>` 组件

**解决方案**：
1. 检查菜单项的 URL 是否正确
2. 确保使用 Next.js 的 `Link` 组件
3. 在浏览器控制台检查 `usePathname()` 返回的路径

### 问题：父菜单不展开

**可能原因**：
子菜单的 URL 不包含父菜单的路径前缀

**解决方案**：
确保子菜单 URL 包含父菜单路径：
```tsx
// ❌ 错误
{ title: "Dashboard", url: "/dashboard", items: [
  { title: "Overview", url: "/overview" }  // 缺少前缀
]}

// ✅ 正确
{ title: "Dashboard", url: "/dashboard", items: [
  { title: "Overview", url: "/dashboard/overview" }  // 包含前缀
]}
```

### 问题：点击菜单页面不跳转

**可能原因**：
使用了 `<a>` 标签导致页面刷新

**解决方案**：
使用 Next.js 的 `Link` 组件：
```tsx
import Link from "next/link";

<SidebarMenuButton asChild>
  <Link href={item.url}>Menu Item</Link>
</SidebarMenuButton>
```

## 性能优化

### 1. useMemo 缓存

`useIsActive` hook 内部使用 `useMemo` 来缓存匹配结果：

```tsx
const isActive = useMemo(() => {
  return pathname.startsWith(itemUrl);
}, [pathname, itemUrl]);
```

### 2. 避免在循环中创建 Hook

```tsx
// ❌ 错误：在循环中调用 hook
{items.map(item => useIsActive(item.url))}

// ✅ 正确：在组件内部调用
const isActive = useIsActive(item.url);
```

## 下一步

- 实现菜单项的徽章（badge）显示未读数
- 添加菜单项的拖拽排序功能
- 支持动态添加/删除菜单项
- 实现菜单项的搜索功能
