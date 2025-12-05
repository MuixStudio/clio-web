/**
 * 用户服务模块
 * 提供用户信息相关的 API 接口
 */
import { get } from "./base";

/**
 * 用户信息数据结构
 */
export interface UserInfo {
  /** 用户 ID */
  id: string;
  /** 用户名称 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 用户头像 URL（可选） */
  avatar_url?: string;
  /** 其他扩展字段 */
  [key: string]: any;
}

/**
 * 获取当前用户信息
 * 从后端接口获取当前登录用户的详细信息
 * @returns Promise<UserInfo> 用户信息对象
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await get<{
    code: number;
    message: string;
    data: { user: UserInfo };
  }>("/api/v1/userinfo", {}, { isAuthURL: true });

  return response.data.user;
};
