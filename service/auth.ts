/**
 * 认证服务模块
 * 提供用户登录、注销、刷新令牌等认证相关功能
 */
import { post } from "./base";

/**
 * 注销响应数据结构
 */
export interface LogoutResponse {
  /** 注销成功消息 */
  message: string;
}

/**
 * 刷新令牌响应数据结构
 */
export interface RefreshTokenResponse {
  /** 新的访问令牌 */
  access_token: string;
  /** 新的刷新令牌 */
  refresh_token: string;
  /** 访问令牌过期时间（秒） */
  expires_in: number;
  /** 令牌类型，通常为 "Bearer" */
  token_type: string;
}

/**
 * 用户注销
 * 调用后端接口撤销刷新令牌并清除 cookies
 * @returns Promise 包含注销响应数据
 */
export const logout = () => {
  return post<{ data: LogoutResponse }>(
    "/auth/logout",
    {},
    { isAuthURL: true },
  );
};

/**
 * 刷新访问令牌
 * 使用 refresh_token cookie 获取新的访问令牌和刷新令牌
 * @returns Promise 包含新的令牌信息
 */
export const refreshToken = () => {
  return post<{ data: RefreshTokenResponse }>(
    "/auth/refresh_token",
    {},
    { isAuthURL: true, silent: true, skipRefreshToken: true },
  );
};
