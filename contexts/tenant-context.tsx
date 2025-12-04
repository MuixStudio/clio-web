"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * 租户上下文类型
 */
interface TenantContextType {
  /** 当前选中的租户 ID */
  currentTenantId: string | null;
  /** 切换租户 */
  setCurrentTenantId: (tenantId: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const TENANT_STORAGE_KEY = "current_tenant_id";

/**
 * 租户 Provider 组件
 * 管理当前选中的租户 ID，并持久化到 localStorage
 */
export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenantId, setCurrentTenantIdState] = useState<string | null>(
    null,
  );

  // 初始化时从 localStorage 读取
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTenantId = localStorage.getItem(TENANT_STORAGE_KEY);

      if (savedTenantId) {
        setCurrentTenantIdState(savedTenantId);
      }
    }
  }, []);

  // 切换租户并持久化
  const setCurrentTenantId = useCallback((tenantId: string) => {
    setCurrentTenantIdState(tenantId);
    if (typeof window !== "undefined") {
      localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentTenantId,
      setCurrentTenantId,
    }),
    [currentTenantId, setCurrentTenantId],
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

/**
 * 使用租户上下文的 Hook
 * @returns {TenantContextType} 租户上下文
 */
export function useTenantContext() {
  const context = useContext(TenantContext);

  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider");
  }

  return context;
}
