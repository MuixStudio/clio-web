"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const themes = [
  {
    value: "light",
    label: "亮色",
    icon: Sun,
    description: "使用亮色主题",
  },
  {
    value: "dark",
    label: "暗色",
    icon: Moon,
    description: "使用暗色主题",
  },
  {
    value: "system",
    label: "跟随系统",
    icon: Monitor,
    description: "跟随系统主题设置",
  },
];

const fontSizes = [
  { value: "small", label: "小", className: "text-sm" },
  { value: "medium", label: "中", className: "text-base" },
  { value: "large", label: "大", className: "text-lg" },
];

const languages = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
  { value: "ja-JP", label: "日本語" },
];

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("zh-CN");
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取偏好设置
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedLanguage = localStorage.getItem("language") || "zh-CN";

    setFontSize(savedFontSize);
    setLanguage(savedLanguage);
  }, []);

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    localStorage.setItem("fontSize", value);
    // 实际应用中应该更新全局状态或 CSS 变量
    document.documentElement.setAttribute("data-font-size", value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    // 实际应用中应该触发 i18n 切换
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">外观设置</h3>
        <p className="text-sm text-muted-foreground">
          自定义应用的外观和显示方式
        </p>
      </div>
      <Separator />

      {/* 主题选择 */}
      <Card>
        <CardHeader>
          <CardTitle>主题</CardTitle>
          <CardDescription>选择应用的外观主题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {themes.map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.value;

              return (
                <button
                  key={item.value}
                  className={cn(
                    "relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-accent",
                    isActive ? "border-primary bg-accent" : "border-border",
                  )}
                  onClick={() => setTheme(item.value)}
                >
                  <Icon
                    className={cn(
                      "h-8 w-8",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="space-y-1 text-center">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 字体大小 */}
      <Card>
        <CardHeader>
          <CardTitle>字体大小</CardTitle>
          <CardDescription>调整界面文字的显示大小</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {fontSizes.map((item) => {
              const isActive = fontSize === item.value;

              return (
                <button
                  key={item.value}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent",
                    isActive ? "border-primary bg-accent" : "border-border",
                  )}
                  onClick={() => handleFontSizeChange(item.value)}
                >
                  <span
                    className={cn(
                      "font-medium",
                      item.className,
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Aa
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 语言设置 */}
      <Card>
        <CardHeader>
          <CardTitle>语言</CardTitle>
          <CardDescription>选择应用的显示语言</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label className="w-24" htmlFor="language">
              界面语言
            </Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[200px]" id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
