"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Check,
  Copy,
  Key,
  Loader2,
  MoreVertical,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Token {
  id: string;
  name: string;
  token?: string; // 仅在创建时返回完整 token
  prefix: string; // token 前缀（用于显示）
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
}

interface CreateTokenForm {
  name: string;
  permissions: string;
  expiresIn: string;
}

// Mock 数据
const mockTokens: Token[] = [
  {
    id: "1",
    name: "Development API",
    prefix: "clio_dev_****",
    permissions: ["read", "write"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 天前
    lastUsed: new Date(Date.now() - 1000 * 60 * 5), // 5 分钟前
  },
  {
    id: "2",
    name: "Production Deploy",
    prefix: "clio_prod_****",
    permissions: ["read"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 天前
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 天后过期
  },
];

const permissionOptions = [
  { value: "read", label: "只读" },
  { value: "write", label: "读写" },
  { value: "admin", label: "管理员" },
];

const expirationOptions = [
  { value: "30", label: "30 天" },
  { value: "60", label: "60 天" },
  { value: "90", label: "90 天" },
  { value: "never", label: "永不过期" },
];

export default function TokensPage() {
  const {
    data: tokens,
    isLoading,
    mutate,
  } = useSWR<Token[]>("/user/tokens", async () => {
    // TODO: 实现实际的 API 调用
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockTokens;
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [newToken, setNewToken] = useState<Token | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [createForm, setCreateForm] = useState<CreateTokenForm>({
    name: "",
    permissions: "read",
    expiresIn: "90",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState<string | null>(null);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // TODO: 实现实际的创建令牌逻辑
      // const response = await post("/user/tokens", createForm);

      // 模拟 API 响应
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockNewToken: Token = {
        id: String(Date.now()),
        name: createForm.name,
        token: `clio_${createForm.permissions}_${Math.random().toString(36).substring(2, 15)}`,
        prefix: `clio_${createForm.permissions}_****`,
        permissions: [createForm.permissions],
        createdAt: new Date(),
        expiresAt:
          createForm.expiresIn !== "never"
            ? new Date(
                Date.now() +
                  parseInt(createForm.expiresIn) * 24 * 60 * 60 * 1000,
              )
            : undefined,
      };

      setNewToken(mockNewToken);
      setShowCreateDialog(false);
      setShowTokenDialog(true);
      setCreateForm({ name: "", permissions: "read", expiresIn: "90" });

      toast.success("令牌创建成功");
      mutate();
    } catch (error) {
      console.error("Token creation failed:", error);
      toast.error("创建失败，请重试");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyToken = () => {
    if (newToken?.token) {
      navigator.clipboard.writeText(newToken.token);
      setTokenCopied(true);
      toast.success("令牌已复制到剪贴板");
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    setRevoking(tokenId);

    try {
      // TODO: 实现实际的撤销逻辑
      // await post(`/user/tokens/${tokenId}/revoke`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("令牌已撤销");
      mutate();
      setShowRevokeDialog(null);
    } catch (error) {
      console.error("Token revocation failed:", error);
      toast.error("撤销失败，请重试");
    } finally {
      setRevoking(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Separator />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">API 令牌</h3>
          <p className="text-sm text-muted-foreground">管理您的 API 访问令牌</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          创建令牌
        </Button>
      </div>
      <Separator />

      {/* 令牌列表 */}
      {tokens && tokens.length > 0 ? (
        <div className="space-y-4">
          {tokens.map((token) => (
            <TokenCard
              key={token.id}
              isRevoking={revoking === token.id}
              token={token}
              onRevoke={() => setShowRevokeDialog(token.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Key className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">还没有 API 令牌</p>
            <p className="mt-2 text-sm text-muted-foreground">
              创建一个令牌来访问 API
            </p>
            <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建令牌
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 创建令牌对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建 API 令牌</DialogTitle>
            <DialogDescription>
              创建一个新的 API 访问令牌。令牌仅在创建时显示一次。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateToken}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token-name">令牌名称</Label>
                <Input
                  required
                  id="token-name"
                  placeholder="例如: Development API"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  用于识别此令牌的用途
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissions">权限</Label>
                <Select
                  value={createForm.permissions}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({ ...prev, permissions: value }))
                  }
                >
                  <SelectTrigger id="permissions">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration">过期时间</Label>
                <Select
                  value={createForm.expiresIn}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({ ...prev, expiresIn: value }))
                  }
                >
                  <SelectTrigger id="expiration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isCreating}
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                取消
              </Button>
              <Button disabled={isCreating} type="submit">
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                创建
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 显示新创建的令牌 */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>令牌创建成功</DialogTitle>
            <DialogDescription>
              请立即复制此令牌。出于安全考虑，您将无法再次查看它。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>令牌</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  className="font-mono text-sm"
                  type={showToken ? "text" : "password"}
                  value={newToken?.token || ""}
                />
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={handleCopyToken}
                >
                  {tokenCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium text-foreground">安全提示：</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>请妥善保管此令牌</li>
                <li>不要将令牌提交到代码库</li>
                <li>如果令牌泄露，请立即撤销</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTokenDialog(false)}>
              我已复制令牌
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 撤销确认对话框 */}
      <AlertDialog
        open={showRevokeDialog !== null}
        onOpenChange={(open) => !open && setShowRevokeDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>撤销令牌？</AlertDialogTitle>
            <AlertDialogDescription>
              撤销后，使用此令牌的应用将无法访问 API。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking !== null}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={revoking !== null}
              onClick={() =>
                showRevokeDialog && handleRevokeToken(showRevokeDialog)
              }
            >
              {revoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认撤销
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface TokenCardProps {
  token: Token;
  onRevoke: () => void;
  isRevoking: boolean;
}

function TokenCard({ token, onRevoke, isRevoking }: TokenCardProps) {
  const isExpired = token.expiresAt && token.expiresAt < new Date();

  return (
    <Card className={cn(isExpired && "opacity-60")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{token.name}</CardTitle>
              {isExpired && (
                <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                  已过期
                </span>
              )}
            </div>
            <CardDescription className="font-mono text-xs">
              {token.prefix}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                disabled={isRevoking}
                onClick={onRevoke}
              >
                {isRevoking ? "撤销中..." : "撤销令牌"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>权限:</span>
            <span className="font-medium text-foreground">
              {token.permissions.join(", ")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>创建时间:</span>
            <span>
              {formatDistanceToNow(token.createdAt, {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
          {token.lastUsed && (
            <div className="flex items-center justify-between">
              <span>最后使用:</span>
              <span>
                {formatDistanceToNow(token.lastUsed, {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          )}
          {token.expiresAt && (
            <div className="flex items-center justify-between">
              <span>过期时间:</span>
              <span className={cn(isExpired && "font-medium text-destructive")}>
                {isExpired
                  ? "已过期"
                  : formatDistanceToNow(token.expiresAt, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
