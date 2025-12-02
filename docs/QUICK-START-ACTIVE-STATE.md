# 快速开始：侧边栏菜单选中状态

## 功能已就绪 ✅

你的侧边栏现在已经**自动支持**菜单项的点击跟踪和选中状态高亮！

## 它是如何工作的？

### 自动跟踪
- 基于 Next.js 的路由系统
- 无需手动管理状态
- 点击菜单后自动高亮

### 智能匹配
```
当前URL: /dashboard/analytics

自动激活:
✅ Dashboard 菜单（父菜单）
✅ Analytics 子菜单
✅ Dashboard 折叠面板自动展开
```

## 使用方法

### 方式一：直接使用（推荐）

侧边栏组件已经内置了选中状态功能，无需任何额外配置：

```tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />  {/* 已内置选中状态跟踪 */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

### 方式二：自定义菜单项

如果需要创建自己的菜单项：

```tsx
import { useIsActive } from "@/hooks/use-active-item";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";

export function MyMenuItem() {
  const isActive = useIsActive("/my-path");

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href="/my-path">
        My Menu Item
      </Link>
    </SidebarMenuButton>
  );
}
```

## 关键点

### ✅ 必须使用 Next.js Link

```tsx
// ✅ 正确
<SidebarMenuButton asChild>
  <Link href="/path">Menu Item</Link>
</SidebarMenuButton>

// ❌ 错误 - 会导致页面刷新
<SidebarMenuButton>
  <a href="/path">Menu Item</a>
</SidebarMenuButton>
```

### ✅ URL 路径要匹配

```tsx
// 配置菜单项
{
  title: "Dashboard",
  url: "/dashboard",  // 父路径
  items: [
    {
      title: "Overview",
      url: "/dashboard/overview",  // 子路径包含父路径
    },
  ],
}
```

## 视觉效果

激活的菜单项会自动应用以下样式：
- ✨ 特殊的背景色（`bg-sidebar-accent`）
- ✨ 强调的文字颜色（`text-sidebar-accent-foreground`）
- ✨ 平滑的过渡动画

## 创建的文件

```
hooks/
└── use-active-item.ts        ← 核心Hook

components/sidebar/
├── nav-main.tsx               ← 已更新（支持选中状态）
└── nav-projects.tsx           ← 已更新（支持选中状态）

docs/
├── sidebar-active-state-guide.md  ← 详细文档
└── QUICK-START-ACTIVE-STATE.md   ← 本文件
```

## API

### `useIsActive(url, exact?)`

检查菜单项是否应该被激活。

```tsx
// 前缀匹配（默认）
const isActive = useIsActive("/dashboard");
// /dashboard, /dashboard/overview, /dashboard/analytics 都会匹配

// 精确匹配
const isExact = useIsActive("/dashboard", true);
// 只有 /dashboard 会匹配
```

### `useActivePath()`

获取当前路由路径。

```tsx
const pathname = useActivePath();  // 返回 "/dashboard/overview"
```

## 示例场景

### 场景 1：嵌套路由
```
访问: /dashboard/analytics

结果:
✅ Dashboard 菜单激活并展开
✅ Analytics 子菜单高亮显示
```

### 场景 2：独立路由
```
访问: /projects/design

结果:
✅ Design 项目高亮
❌ 其他项目保持默认状态
```

## 故障排查

### 问题：菜单项点击后没有高亮

**检查清单**：
1. ✅ 是否使用了 `<Link>` 组件？
2. ✅ 是否传递了 `isActive` 属性？
3. ✅ URL 路径是否正确配置？

**调试方法**：
```tsx
// 在组件中添加调试输出
const isActive = useIsActive("/my-path");
console.log("Is active?", isActive);
console.log("Current path:", useActivePath());
```

### 问题：父菜单不展开

**原因**：子菜单的 URL 没有包含父菜单的路径前缀

**解决**：
```tsx
// ❌ 错误
{ url: "/dashboard", items: [
  { url: "/overview" }  // 缺少前缀
]}

// ✅ 正确
{ url: "/dashboard", items: [
  { url: "/dashboard/overview" }  // 包含父路径
]}
```

## 进一步阅读

- 📖 [完整文档](./sidebar-active-state-guide.md) - 详细的实现原理和高级用法
- 📖 [Sidebar 数据钩子](./sidebar-usage-guide.md) - 如何动态管理侧边栏数据

## 就是这样！

你的侧边栏现在已经完全支持点击跟踪和选中状态了。只需正常使用 Next.js 的路由系统，一切都会自动工作！🎉
