# Settings Pages Implementation TODO

## Overview
实现 `app/(main)/settings` 下的企业级设置页面，包含 5 个子模块。

## Architecture Design

### 布局结构
```
app/(main)/settings/
├── layout.tsx              # Settings 外层布局（侧边栏导航）
├── page.tsx                # 重定向到 /settings/profile
├── profile/
│   └── page.tsx           # 个人资料设置
├── account/
│   └── page.tsx           # 账户安全设置
├── appearance/
│   └── page.tsx           # 外观主题设置
├── sessions/
│   └── page.tsx           # 会话管理
└── tokens/
    └── page.tsx           # API 令牌管理
```

### 技术栈
- **UI 组件**: shadcn/ui (Card, Form, Input, Button, Switch, Select, Tabs)
- **表单处理**: react-hook-form + zod
- **数据请求**: SWR + service layer
- **主题切换**: next-themes
- **通知**: sonner

---

## Task List

### Phase 1: 基础架构 ✅
- [x] 创建 TODO.md
- [ ] 创建 `settings/layout.tsx` - 侧边栏导航布局
- [ ] 创建 `settings/page.tsx` - 默认页重定向
- [ ] 添加必要的 shadcn 组件（如果缺失）

### Phase 2: 核心页面
#### 2.1 Profile Page (个人资料)
- [ ] 创建 `profile/page.tsx`
- [ ] 实现表单字段:
  - 头像上传
  - 用户名
  - 邮箱
  - 个人简介
  - 社交链接（可选）
- [ ] 集成 API service (`service/user.ts`)
- [ ] 表单验证 (zod schema)
- [ ] 保存/取消操作

#### 2.2 Account Page (账户安全)
- [ ] 创建 `account/page.tsx`
- [ ] 实现功能模块:
  - 修改密码
  - 两步验证设置
  - 删除账户（危险操作）
- [ ] 创建 `service/account.ts`
- [ ] 添加确认对话框组件

#### 2.3 Appearance Page (外观设置)
- [ ] 创建 `appearance/page.tsx`
- [ ] 实现功能:
  - 主题切换（亮色/暗色/系统）
  - 语言选择
  - 字体大小
  - 色彩方案（可选）
- [ ] 集成 `next-themes`
- [ ] 本地存储偏好设置

#### 2.4 Sessions Page (会话管理)
- [ ] 创建 `sessions/page.tsx`
- [ ] 实现功能:
  - 显示活跃会话列表（设备、位置、时间）
  - 当前会话标识
  - 撤销其他会话
  - 撤销单个会话
- [ ] 创建 `service/session.ts`
- [ ] 添加 Session Card 组件

#### 2.5 Tokens Page (API 令牌)
- [ ] 创建 `tokens/page.tsx`
- [ ] 实现功能:
  - 令牌列表展示
  - 创建新令牌（名称、权限、过期时间）
  - 复制令牌（仅创建时显示）
  - 撤销令牌
  - 最后使用时间
- [ ] 创建 `service/token.ts`
- [ ] 添加 Token Dialog 组件

### Phase 3: 共享组件
- [ ] 创建 `components/settings/settings-header.tsx` - 页面标题组件
- [ ] 创建 `components/settings/settings-section.tsx` - 设置区块组件
- [ ] 创建 `components/settings/danger-zone.tsx` - 危险操作区域
- [ ] 创建 `components/settings/form-message.tsx` - 表单消息提示

### Phase 4: API Services
- [ ] 扩展 `service/user.ts` - 用户资料更新
- [ ] 创建 `service/account.ts` - 账户安全操作
- [ ] 创建 `service/session.ts` - 会话管理
- [ ] 创建 `service/token.ts` - 令牌管理
- [ ] 添加 TypeScript 类型定义

### Phase 5: 测试与优化
- [ ] 添加加载状态
- [ ] 添加错误处理
- [ ] 表单验证完善
- [ ] 响应式设计检查
- [ ] 无障碍性优化 (a11y)

---

## Design Principles

### 1. 一致性
- 所有页面使用统一的布局和间距
- 表单样式统一（Label + Input + Help Text + Error）
- 按钮操作位置统一（右下角 Save/Cancel）

### 2. 用户体验
- 自动保存草稿（可选）
- 操作前确认（删除、撤销）
- 即时验证反馈
- 成功/失败 toast 提示

### 3. 安全性
- 敏感操作需要二次确认
- 密码修改需要旧密码验证
- 令牌仅在创建时完整显示一次
- 会话管理支持强制登出

### 4. 性能
- 使用 SWR 缓存
- 表单防抖
- 图片上传预处理（压缩）
- 懒加载非关键组件

---

## Implementation Order

**建议实现顺序**（由简到难）:
1. Appearance (最简单，无 API 依赖)
2. Profile (标准 CRUD)
3. Account (涉及敏感操作)
4. Sessions (列表 + 删除操作)
5. Tokens (CRUD + 权限管理)

---

## Notes
- 所有 API 端点需要与后端对齐
- Mock 数据可先用于开发
- 图标使用 lucide-react
- 动画使用 Framer Motion（已有）
