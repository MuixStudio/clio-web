# Sidebar 钩子使用指南

本目录包含用于动态获取侧边栏数据的自定义钩子。

## 核心钩子

### `useSidebarData()`

获取完整的侧边栏数据，包括用户信息、团队、菜单和项目。

```tsx
import { useSidebarData } from "@/hooks/use-sidebar-data";

export function AppSidebar() {
  const data = useSidebarData();

  if (!data) {
    return <Loading />;
  }

  return (
    <Sidebar>
      <TeamSwitcher teams={data.teams} />
      <NavMain items={data.navMain} />
      <NavProjects projects={data.projects} />
      <NavUser user={data.user} />
    </Sidebar>
  );
}
```

**特点**：
- 自动集成现有的用户信息（通过 SWR）
- 使用 useMemo 优化性能
- 加载中时返回 null

## 独立钩子

### `useNavItems(userRole?: string)`

根据用户角色动态生成导航菜单。

```tsx
import { useNavItems } from "@/hooks/use-nav-items";

export function MyNav() {
  const navItems = useNavItems("admin"); // 管理员可以看到更多菜单

  return <NavMain items={navItems} />;
}
```

**参数**：
- `userRole` - 用户角色（"admin" | "owner" | "user" 等）

**返回**：导航菜单项列表

### `useProjects()`

从API获取项目列表。

```tsx
import { useProjects } from "@/hooks/use-projects";

export function ProjectList() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return <NavProjects projects={projects} />;
}
```

**返回**：
- `projects` - 项目列表
- `isLoading` - 加载状态
- `error` - 错误信息

### `useTeams()`

从API获取团队列表。

```tsx
import { useTeams } from "@/hooks/use-teams";

export function TeamSelector() {
  const { teams, isLoading, error } = useTeams();

  if (isLoading) return <Skeleton />;

  return <TeamSwitcher teams={teams} />;
}
```

## 高级用法

### 组合多个钩子

```tsx
import { useNavItems } from "@/hooks/use-nav-items";
import { useProjects } from "@/hooks/use-projects";
import { useTeams } from "@/hooks/use-teams";
import useSWR from "swr";
import { getUserInfo } from "@/service/user";

export function CustomSidebar() {
  // 获取用户信息
  const { data: userInfo } = useSWR("/userinfo", getUserInfo);

  // 根据用户角色获取菜单
  const navItems = useNavItems(userInfo?.role);

  // 获取项目
  const { projects, isLoading: projectsLoading } = useProjects();

  // 获取团队
  const { teams, isLoading: teamsLoading } = useTeams();

  if (!userInfo || projectsLoading || teamsLoading) {
    return <Loading />;
  }

  return (
    <Sidebar>
      <TeamSwitcher teams={teams} />
      <NavMain items={navItems} />
      <NavProjects projects={projects} />
      <NavUser user={userInfo} />
    </Sidebar>
  );
}
```

### 自定义数据获取

如果需要从不同的API端点获取数据，可以创建自己的钩子：

```tsx
// hooks/use-my-custom-data.ts
import useSWR from "swr";
import { get } from "@/service/base";

export function useMyCustomData() {
  const { data, error, isLoading } = useSWR(
    "/api/my-endpoint",
    () => get("/api/my-endpoint")
  );

  return {
    data,
    isLoading,
    error,
  };
}
```

### 动态菜单激活状态

根据当前路由设置菜单项的激活状态：

```tsx
import { usePathname } from "next/navigation";
import { useNavItems } from "@/hooks/use-nav-items";

export function DynamicNav() {
  const pathname = usePathname();
  const baseNavItems = useNavItems();

  // 根据当前路径设置激活状态
  const navItems = baseNavItems.map(item => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return <NavMain items={navItems} />;
}
```

## 数据类型

所有类型定义在 `types/sidebar.ts` 中：

```typescript
import type {
  NavItem,
  Project,
  SidebarUser,
  Team,
  SidebarData,
} from "@/types/sidebar";
```

## 最佳实践

1. **使用 useMemo 缓存计算结果**
   ```tsx
   const data = useMemo(() => {
     // 复杂的数据处理
     return processedData;
   }, [dependencies]);
   ```

2. **处理加载状态**
   ```tsx
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorMessage />;
   ```

3. **配置 SWR 选项**
   ```tsx
   useSWR("/api/data", fetcher, {
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
   });
   ```

4. **避免过度请求**
   - 使用 SWR 的缓存机制
   - 合理设置 revalidate 选项
   - 考虑使用 `useSidebarData()` 而不是多个独立钩子

## 待办事项

当前的钩子使用模拟数据，需要连接到真实的API：

- [ ] `useProjects` - 连接到项目API
- [ ] `useTeams` - 连接到团队API
- [ ] `useNavItems` - 根据实际的权限系统调整
