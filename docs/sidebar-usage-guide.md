# Sidebar 动态数据使用指南

## 概述

本项目为侧边栏组件创建了一套完整的钩子系统，允许动态传入菜单、项目和用户信息。

## 文件结构

```
├── types/
│   └── sidebar.ts                  # 侧边栏类型定义
├── hooks/
│   ├── use-sidebar-data.ts         # 核心钩子 - 获取完整侧边栏数据
│   ├── use-nav-items.ts            # 根据用户角色生成导航菜单
│   ├── use-projects.ts             # 获取项目列表
│   ├── use-teams.ts                # 获取团队列表
│   └── README.md                   # 钩子使用文档
├── components/sidebar/
│   ├── app-sidebar.tsx             # 主侧边栏组件（使用钩子）
│   ├── sidebar-example.tsx         # 高级用法示例
│   ├── nav-main.tsx                # 主导航组件
│   ├── nav-projects.tsx            # 项目列表组件
│   ├── nav-user.tsx                # 用户信息组件
│   └── team-switcher.tsx           # 团队切换组件
```

## 快速开始

### 1. 基础用法（推荐）

使用 `useSidebarData()` 钩子获取所有数据：

```tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

`AppSidebar` 组件会自动：
- 从 API 获取用户信息
- 加载团队、项目和菜单数据
- 显示加载骨架屏
- 处理错误状态

### 2. 自定义菜单（根据用户角色）

使用 `useNavItems()` 钩子根据用户角色生成不同的菜单：

```tsx
import { useNavItems } from "@/hooks/use-nav-items";
import useSWR from "swr";
import { getUserInfo } from "@/service/user";

export function MyCustomSidebar() {
  const { data: userInfo } = useSWR("/userinfo", getUserInfo);

  // 管理员会看到额外的"Settings"菜单
  const navItems = useNavItems(userInfo?.role);

  return <NavMain items={navItems} />;
}
```

### 3. 独立使用各个钩子

如果需要更细粒度的控制：

```tsx
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";

export function CustomSidebar() {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { teams, isLoading: teamsLoading } = useTeams();

  if (projectsLoading || teamsLoading) {
    return <Loading />;
  }

  return (
    <Sidebar>
      <TeamSwitcher teams={teams} />
      <NavProjects projects={projects} />
    </Sidebar>
  );
}
```

## 类型定义

所有类型都定义在 `types/sidebar.ts`：

```typescript
import type {
  NavItem,        // 导航菜单项
  Project,        // 项目
  SidebarUser,    // 用户信息
  Team,           // 团队
  SidebarData,    // 完整侧边栏数据
} from "@/types/sidebar";
```

### NavItem

```typescript
interface NavItem {
  title: string;              // 菜单标题
  url: string;                // 菜单链接
  icon?: LucideIcon;          // 菜单图标
  isActive?: boolean;         // 是否激活
  items?: {                   // 子菜单
    title: string;
    url: string;
  }[];
}
```

### Project

```typescript
interface Project {
  name: string;               // 项目名称
  url: string;                // 项目链接
  icon: LucideIcon;           // 项目图标
}
```

### SidebarUser

```typescript
interface SidebarUser {
  name: string;               // 用户名
  email: string;              // 用户邮箱
  avatar: string;             // 用户头像URL
}
```

## 数据来源

### 当前实现

1. **用户信息** - 从现有的 `getUserInfo()` API 获取
2. **团队列表** - 使用模拟数据（可替换为 API）
3. **项目列表** - 使用模拟数据（可替换为 API）
4. **导航菜单** - 根据用户角色动态生成

### 连接真实 API

要连接到真实的 API，修改对应的钩子：

#### 项目 API

编辑 `hooks/use-projects.ts`：

```typescript
import { get } from "@/service/base";

const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const response = await get<{ data: ProjectResponse[] }>("/api/projects");
  return response.data;
};
```

#### 团队 API

编辑 `hooks/use-teams.ts`：

```typescript
import { get } from "@/service/base";

const fetchTeams = async (): Promise<TeamResponse[]> => {
  const response = await get<{ data: TeamResponse[] }>("/api/teams");
  return response.data;
};
```

## 高级功能

### 1. 动态菜单激活状态

根据当前路由自动激活菜单项：

```tsx
import { usePathname } from "next/navigation";
import { useNavItems } from "@/hooks/use-nav-items";

export function DynamicNav() {
  const pathname = usePathname();
  const baseItems = useNavItems();

  const items = baseItems.map(item => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return <NavMain items={items} />;
}
```

### 2. 基于权限的菜单

在 `useNavItems()` 中已经实现了简单的权限控制：

```typescript
export function useNavItems(userRole?: string): NavItem[] {
  // 只有管理员和所有者能看到设置菜单
  if (userRole === "admin" || userRole === "owner") {
    baseItems.push({
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      // ...
    });
  }
}
```

你可以扩展这个逻辑来实现更复杂的权限控制。

### 3. 缓存和性能优化

所有钩子都使用 SWR，自动提供：
- 缓存
- 自动重新验证
- 错误重试
- 加载状态

配置选项：

```typescript
useSWR("/api/data", fetcher, {
  revalidateOnFocus: false,      // 窗口聚焦时不重新验证
  revalidateOnReconnect: false,  // 重新连接时不重新验证
  dedupingInterval: 60000,       // 60秒内的重复请求会被去重
});
```

## 故障排查

### 问题：侧边栏一直显示加载状态

**原因**：用户信息 API 可能失败或返回空数据

**解决**：
1. 检查浏览器控制台的网络请求
2. 确认 `/userinfo` API 正常返回数据
3. 检查 `service/user.ts` 中的 `getUserInfo()` 实现

### 问题：菜单显示但没有图标

**原因**：图标导入可能有问题

**解决**：
1. 确认 `lucide-react` 已安装
2. 检查图标名称是否正确
3. 在 `hooks/use-nav-items.ts` 中检查图标导入

### 问题：类型错误

**原因**：类型定义可能与实际数据不匹配

**解决**：
1. 检查 `types/sidebar.ts` 中的类型定义
2. 确保 API 返回的数据结构匹配类型定义
3. 使用 TypeScript 的类型推断来发现问题

## 示例代码

完整的高级用法示例请查看：
- `components/sidebar/sidebar-example.tsx` - 组合多个钩子的完整示例
- `hooks/README.md` - 所有钩子的详细文档和用法

## 下一步

1. 将模拟数据替换为真实的 API 调用
2. 根据实际的权限系统调整 `useNavItems()`
3. 添加更多的菜单项和功能
4. 实现菜单项的点击处理
5. 添加搜索和过滤功能
