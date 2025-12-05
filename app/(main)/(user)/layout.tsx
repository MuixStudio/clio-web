"use client";

import {
  CircleUserRound,
  FingerprintPattern,
  KeyRound,
  Palette,
  Settings,
  ShieldUser,
} from "lucide-react";
import { useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import { useMenu } from "@/components/sidebar/nav-main";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { setMenu } = useMenu();

  useEffect(() => {
    setMenu(
      {
        navGroups: [
          {
            name: "Settings",
            items: [
              {
                title: "profile",
                url: "/settings/profile",
                icon: CircleUserRound,
              },
              {
                title: "account",
                url: "/settings/account",
                icon: FingerprintPattern,
              },
              {
                title: "Appearance",
                url: "/settings/appearance",
                icon: Palette,
              },
              {
                title: "Token",
                url: "/settings/tokens",
                icon: KeyRound,
              },
              {
                title: "Sessions",
                url: "/settings/sessions",
                icon: ShieldUser,
              },
            ],
          },
        ],
      },
      1,
    );
  }, [setMenu]);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-2xl font-bold tracking-tight">设置</h2>
        </div>
        <p className="text-muted-foreground">管理您的账户设置和偏好配置</p>
      </div>
      <Separator />
      <div className="max-w-4xl">{children}</div>
    </div>
  );
}
