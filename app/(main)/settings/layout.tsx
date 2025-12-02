import { Settings } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-2xl font-bold tracking-tight">设置</h2>
        </div>
        <p className="text-muted-foreground">
          管理您的账户设置和偏好配置
        </p>
      </div>
      <Separator />
      <div className="max-w-4xl">{children}</div>
    </div>
  );
}
