"use client";

import { useState } from "react";
import useSWR from "swr";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserInfo } from "@/service/user";
import { post } from "@/service/base";

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  avatar?: string;
}

export default function ProfilePage() {
  const { data: userInfo, isLoading, mutate } = useSWR(
    "/userinfo",
    getUserInfo,
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 当用户信息加载完成后，初始化表单
  useState(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        bio: userInfo.bio || "",
        avatar: userInfo.avatar,
      });
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // 实际应用中应该上传到服务器或 CDN
      const formData = new FormData();
      formData.append("avatar", file);

      // TODO: 实现实际的上传逻辑
      // const response = await post("/user/avatar", formData, {
      //   deleteContentType: true,
      // });

      // 临时：使用本地 URL
      const avatarUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));

      toast.success("头像上传成功");
      mutate();
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("头像上传失败，请重试");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: 实现实际的保存逻辑
      // await post("/user/profile", formData);

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("个人资料已更新");
      mutate();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        bio: userInfo.bio || "",
        avatar: userInfo.avatar,
      });
      toast.info("已重置为原始值");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Separator />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">个人资料</h3>
        <p className="text-sm text-muted-foreground">
          管理您的公开个人资料信息
        </p>
      </div>
      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 头像上传 */}
        <Card>
          <CardHeader>
            <CardTitle>头像</CardTitle>
            <CardDescription>
              点击头像上传新图片，支持 JPG、PNG 格式，最大 5MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar || userInfo?.avatar} alt="Avatar" />
                  <AvatarFallback className="text-2xl">
                    {formData.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>推荐尺寸: 400x400 像素</p>
                <p>格式: JPG, PNG</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              您的公开个人信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">用户名</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="输入您的用户名"
                required
              />
              <p className="text-xs text-muted-foreground">
                这是您的公开显示名称，可以是您的真实姓名或昵称
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                用于接收通知和找回密码
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="简单介绍一下自己..."
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length} / 200 字符
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            重置
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存更改
          </Button>
        </div>
      </form>
    </div>
  );
}
