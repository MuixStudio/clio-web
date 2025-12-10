/**
 * 用户服务模块
 * 提供用户信息相关的 API 接口
 */
import { get } from "./base";

/**
 * 用户信息数据结构
 */
export interface TenantRsp {
  /** 租户 ID */
  tenant_id: string;
  /** 用户名称 */
  name: string;
  /** 租户头像 URL（可选） */
  logo_url?: string;
  /** 租户头像 URL（可选） */
  plan_type: string;
  /** 租户头像 URL（可选） */
  status: string;
  /** 租户头像 URL（可选） */
  identity: string;
}

export type TenantsRsp = TenantRsp[];

/**
 * 获取当前用户信息
 * 从后端接口获取当前登录用户的详细信息
 * @returns Promise<UserInfo> 用户信息对象
 */
export const listTenants = async (): Promise<TenantsRsp> => {
  const response = await get<{
    code: number;
    message: string;
    data: { tenants: TenantsRsp };
  }>("/api/v1/tenants", {}, { isAuthURL: true });

  return response.data.tenants;
};

export const getCurrentTenant = async (): Promise<TenantRsp> => {
  const response = await get<{
    code: number;
    message: string;
    data: { tenant: TenantRsp };
  }>("/api/v1/tenant", {}, { isAuthURL: true });

  return response.data.tenant;
};
