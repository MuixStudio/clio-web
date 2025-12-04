"use client";

import { useState } from "react";
import useSWR from "swr";
import { Chrome, Smartphone, Monitor, MapPin, Clock, Loader2 } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { get, post } from "@/service/base";

interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  current: boolean;
}

// Mock 数据
const mockSessions: Session[] = [
  {
    id: "1",
    device: "Desktop",
    browser: "Chrome 120",
    os: "macOS 14.0",
    location: "北京, 中国",
    ipAddress: "192.168.1.1",
    lastActive: new Date(),
    current: true,
  },
  {
    id: "2",
    device: "Mobile",
    browser: "Safari 17",
    os: "iOS 17.2",
    location: "上海, 中国",
    ipAddress: "192.168.1.2",
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 分钟前
    current: false,
  },
  {
    id: "3",
    device: "Desktop",
    browser: "Firefox 121",
    os: "Windows 11",
    location: "深圳, 中国",
    ipAddress: "192.168.1.3",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 小时前
    current: false,
  },
];

const getDeviceIcon = (device: string) => {
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes("mobile") || deviceLower.includes("phone")) {
    return Smartphone;
  }
  if (deviceLower.includes("tablet")) {
    return Monitor;
  }
  return Monitor;
};

const getBrowserIcon = (browser: string) => {
  // 实际应用中可以根据浏览器类型返回不同图标
  return Chrome;
};

export default function SessionsPage() {
  // 实际应用中应该从 API 获取
  const { data: sessions, isLoading, mutate } = useSWR<Session[]>(
    "/user/sessions",
    async () => {
      // TODO: 实现实际的 API 调用
      // return await get("/user/sessions");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSessions;
    },
  );

  const [revoking, setRevoking] = useState<string | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId);

    try {
      // TODO: 实现实际的撤销逻辑
      // await post(`/user/sessions/${sessionId}/revoke`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("会话已撤销");
      mutate();
    } catch (error) {
      console.error("Session revocation failed:", error);
      toast.error("撤销失败，请重试");
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    setIsRevokingAll(true);

    try {
      // TODO: 实现实际的撤销所有会话逻辑
      // await post("/user/sessions/revoke-all");

      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("所有其他会话已撤销");
      mutate();
      setShowRevokeAllDialog(false);
    } catch (error) {
      console.error("Revoke all sessions failed:", error);
      toast.error("操作失败，请重试");
    } finally {
      setIsRevokingAll(false);
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const currentSession = sessions?.find((s) => s.current);
  const otherSessions = sessions?.filter((s) => !s.current) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">会话管理</h3>
          <p className="text-sm text-muted-foreground">
            管理您在不同设备上的登录会话
          </p>
        </div>
        {otherSessions.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowRevokeAllDialog(true)}
          >
            撤销所有其他会话
          </Button>
        )}
      </div>
      <Separator />

      {/* 当前会话 */}
      {currentSession && (
        <div>
          <h4 className="mb-4 text-sm font-medium">当前会话</h4>
          <SessionCard session={currentSession} />
        </div>
      )}

      {/* 其他会话 */}
      {otherSessions.length > 0 && (
        <div>
          <h4 className="mb-4 text-sm font-medium">
            其他活跃会话 ({otherSessions.length})
          </h4>
          <div className="space-y-4">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onRevoke={handleRevokeSession}
                isRevoking={revoking === session.id}
              />
            ))}
          </div>
        </div>
      )}

      {otherSessions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Monitor className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              当前没有其他活跃会话
            </p>
          </CardContent>
        </Card>
      )}

      {/* 撤销所有会话确认对话框 */}
      <AlertDialog
        open={showRevokeAllDialog}
        onOpenChange={setShowRevokeAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>撤销所有其他会话？</AlertDialogTitle>
            <AlertDialogDescription>
              这将登出所有其他设备上的会话。您需要在这些设备上重新登录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevokingAll}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAllSessions}
              disabled={isRevokingAll}
            >
              {isRevokingAll && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              确认撤销
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  onRevoke?: (sessionId: string) => void;
  isRevoking?: boolean;
}

function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
  const DeviceIcon = getDeviceIcon(session.device);
  const BrowserIcon = getBrowserIcon(session.browser);

  return (
    <Card
      className={cn(
        "transition-colors",
        session.current && "border-primary bg-accent/50",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-3">
              <DeviceIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                {session.browser}
                {session.current && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-normal text-primary-foreground">
                    当前设备
                  </span>
                )}
              </CardTitle>
              <CardDescription>{session.os}</CardDescription>
            </div>
          </div>
          {!session.current && onRevoke && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRevoke(session.id)}
              disabled={isRevoking}
            >
              {isRevoking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "撤销"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{session.location}</span>
            <span className="text-xs">({session.ipAddress})</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              最后活跃:{" "}
              {formatDistanceToNow(session.lastActive, {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
