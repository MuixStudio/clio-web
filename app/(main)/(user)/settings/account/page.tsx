"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("两次输入的新密码不一致");

      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("密码长度至少为 8 位");

      return;
    }

    setIsChangingPassword(true);

    try {
      // TODO: 实现实际的密码修改逻辑
      // await post("/user/password", {
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword,
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("密码修改成功");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("密码修改失败，请检查当前密码是否正确");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // TODO: 实现实际的两步验证切换逻辑
      // await post("/user/2fa", { enabled });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTwoFactorEnabled(enabled);
      toast.success(enabled ? "两步验证已启用" : "两步验证已关闭");
    } catch (error) {
      console.error("2FA toggle failed:", error);
      toast.error("操作失败，请重试");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: 实现实际的账户删除逻辑
      // await post("/user/delete");

      toast.success("账户已删除");
      // 重定向到登录页
      window.location.href = "/login";
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast.error("删除失败，请重试");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">账户安全</h3>
        <p className="text-sm text-muted-foreground">管理您的账户安全设置</p>
      </div>
      <Separator />

      {/* 修改密码 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>修改密码</CardTitle>
          </div>
          <CardDescription>定期修改密码可以提高账户安全性</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input
                required
                autoComplete="current-password"
                id="currentPassword"
                name="currentPassword"
                placeholder="输入当前密码"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                required
                autoComplete="new-password"
                id="newPassword"
                minLength={8}
                name="newPassword"
                placeholder="输入新密码（至少 8 位）"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                required
                autoComplete="new-password"
                id="confirmPassword"
                minLength={8}
                name="confirmPassword"
                placeholder="再次输入新密码"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">密码要求：</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>至少 8 个字符</li>
                <li>建议包含大小写字母、数字和符号</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isChangingPassword} type="submit">
              {isChangingPassword && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              更新密码
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 两步验证 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>两步验证</CardTitle>
          </div>
          <CardDescription>
            增强账户安全性，登录时需要额外的验证码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">
                {twoFactorEnabled ? "已启用" : "已禁用"}
              </div>
              <div className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? "您的账户已受到两步验证保护"
                  : "启用后需要验证码才能登录"}
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* 危险操作区 */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">危险操作</CardTitle>
          </div>
          <CardDescription>以下操作不可撤销，请谨慎操作</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">
              删除账户将永久删除您的所有数据，包括个人资料、设置和关联的内容。
              此操作无法撤销。
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              删除账户
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除账户吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销。您的所有数据将被永久删除，包括：
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>个人资料和设置</li>
                <li>所有创建的内容</li>
                <li>会话和令牌</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
