/**
 * 基础请求封装模块
 * 提供统一的 HTTP 请求方法，包含错误处理、令牌刷新等功能
 */
import type { ResponseError } from "./fetch";

import { toast } from "sonner";

import { base, getAccessToken, getRefreshToken } from "./fetch";

import { asyncRunSafe } from "@/utils";
import { basePath } from "@/utils/var";
import { API_URI_PREFIX } from "@/config/path";

/**
 * 额外的请求选项配置
 */
export type IOtherOptions = {
  /** 是否为 API 请求 */
  isAPI?: boolean;
  /** 是否为认证相关的 URL（会添加 Authorization 头） */
  isAuthURL?: boolean;
  /** 是否将 body 序列化为 JSON */
  bodyStringify?: boolean;
  /** 是否需要返回完整的响应内容（包括 headers 等） */
  needAllResponseContent?: boolean;
  /** 是否删除 Content-Type 头（用于文件上传等场景） */
  deleteContentType?: boolean;
  /** 是否静默处理错误（不显示错误提示） */
  silent?: boolean;
  /** 获取 AbortController 的回调函数 */
  getAbortController?: (abortController: AbortController) => void;
  /** 是否跳过自动刷新令牌（防止无限循环） */
  skipRefreshToken?: boolean;
};

const baseFetch = base;

/** localStorage 中存储刷新状态的 key */
const LOCAL_STORAGE_KEY = "is_other_tab_refreshing";

/** 是否正在刷新令牌的标志位 */
let isRefreshing = false;

/**
 * 等待其他标签页完成令牌刷新
 */
function waitUntilTokenRefreshed(): Promise<void> {
  return new Promise<void>((resolve) => {
    function _check() {
      const isRefreshingSign =
        globalThis.localStorage?.getItem(LOCAL_STORAGE_KEY);

      if ((isRefreshingSign && isRefreshingSign === "1") || isRefreshing) {
        setTimeout(() => {
          _check();
        }, 1000);
      } else {
        resolve();
      }
    }
    _check();
  });
}

/**
 * 检查刷新标志是否在指定时间内
 */
const isRefreshingSignAvailable = function (delta: number) {
  const nowTime = new Date().getTime();
  const lastTime = globalThis.localStorage?.getItem("last_refresh_time") || "0";

  return nowTime - Number.parseInt(lastTime) <= delta;
};

/**
 * 释放刷新锁
 */
function releaseRefreshLock() {
  if (isRefreshing) {
    isRefreshing = false;
    globalThis.localStorage?.removeItem(LOCAL_STORAGE_KEY);
    globalThis.localStorage?.removeItem("last_refresh_time");
    globalThis.removeEventListener("beforeunload", releaseRefreshLock);
  }
}

/**
 * 处理令牌刷新逻辑
 * 参考 Dify 的实现，使用 localStorage 协调多标签页刷新
 * 使用独立的 fetch 避免无限循环
 * @param timeout 超时时间（毫秒）
 * @returns Promise<boolean> 刷新是否成功
 */
async function handleTokenRefresh(timeout: number = 100000): Promise<boolean> {
  try {
    const isRefreshingSign =
      globalThis.localStorage?.getItem(LOCAL_STORAGE_KEY);

    // 如果其他标签页正在刷新，等待其完成
    if (
      (isRefreshingSign &&
        isRefreshingSign === "1" &&
        isRefreshingSignAvailable(timeout)) ||
      isRefreshing
    ) {
      console.log("[Token Refresh] 等待其他标签页刷新...");
      await waitUntilTokenRefreshed();

      return true;
    }

    console.log("[Token Refresh] 开始刷新令牌...");

    // 注意：由于 access_token 和 refresh_token 是 HttpOnly cookies
    // JavaScript 无法读取它们，但浏览器会自动在请求中发送
    // 所以我们不需要检查 cookies 是否存在，直接尝试刷新即可

    // 设置刷新标志
    isRefreshing = true;
    globalThis.localStorage?.setItem(LOCAL_STORAGE_KEY, "1");
    globalThis.localStorage?.setItem(
      "last_refresh_time",
      new Date().getTime().toString(),
    );
    globalThis.addEventListener("beforeunload", releaseRefreshLock);

    // 重要：使用 globalThis.fetch 而不是 baseFetch
    // 如果刷新令牌接口也返回 401，使用 baseFetch 会导致无限循环
    const response = await globalThis.fetch(
      `${API_URI_PREFIX}/auth/refresh_token`,
      {
        method: "POST",
        credentials: "include", // 重要：发送 cookies（包括 HttpOnly cookies）
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("[Token Refresh] 刷新失败，状态码:", response.status);

      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error("[Token Refresh] 错误详情:", errorData);
      } catch (e) {
        console.error("[Token Refresh] 无法解析错误响应");
      }

      return false;
    }

    console.log("[Token Refresh] 刷新成功，新令牌已通过 cookie 设置");

    return true;
  } catch (error) {
    console.error("[Token Refresh] 刷新异常:", error);

    return false;
  } finally {
    releaseRefreshLock();
  }
}

/**
 * 统一的请求方法
 * 包含自动刷新令牌、错误处理、登录跳转等功能
 * @param url 请求的 URL 路径
 * @param options 请求选项（method, body, headers 等）
 * @param otherOptions 额外的配置选项
 * @returns Promise<T> 返回响应数据
 */
export const request = async <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions,
) => {
  try {
    const otherOptionsForBaseFetch = otherOptions || {};
    const [err, resp] = await asyncRunSafe<T>(
      baseFetch(url, options, otherOptionsForBaseFetch),
    );

    // 请求成功，直接返回数据
    if (err === null) return resp;

    // 调试：输出错误对象的详细信息
    console.log("[Request] 请求失败，错误对象:", {
      err,
      hasStatus: "status" in (err as any),
      status: (err as any)?.status,
      type: typeof err,
      constructor: (err as any)?.constructor?.name,
    });

    const errResp: Response = err as any;

    // 处理 401 未授权错误
    if (errResp.status === 401) {
      console.log(`[Request] 收到 401 错误, URL: ${url}`);
      const loginUrl = `${globalThis.location.origin}${basePath}/login`;

      // 尝试自动刷新令牌（跳过刷新令牌接口本身）
      if (
        !otherOptionsForBaseFetch.skipRefreshToken &&
        url !== "/auth/refresh_token"
      ) {
        console.log("[Request] 尝试刷新令牌...");
        const refreshSuccess = await handleTokenRefresh();

        // 刷新成功后重试原请求
        if (refreshSuccess) {
          console.log(`[Request] 令牌刷新成功，重试请求: ${url}`);
          const [retryErr, retryResp] = await asyncRunSafe<T>(
            baseFetch(url, options, otherOptionsForBaseFetch),
          );

          if (retryErr === null) {
            console.log(`[Request] 重试请求成功: ${url}`);

            return retryResp;
          }
          console.error(`[Request] 重试请求失败: ${url}`, retryErr);
        } else {
          console.log("[Request] 令牌刷新失败，即将跳转登录页");
        }
      } else {
        console.log(
          "[Request] 跳过令牌刷新（skipRefreshToken 或刷新令牌接口本身）",
        );
      }

      // 刷新失败或不需要刷新，显示错误并跳转登录页
      const [parseErr, errRespData] = await asyncRunSafe<ResponseError>(
        errResp.json(),
      );

      if (!parseErr && !otherOptionsForBaseFetch.silent) {
        toast.error(errRespData.message);
      }

      // 避免在登录页重复跳转
      if (location.pathname !== loginUrl) {
        globalThis.location.href = loginUrl;
      }

      return Promise.reject(err);
    }

    return Promise.reject(err);
  } catch (error) {
    console.error(error);

    return Promise.reject(error);
  }
};

/**
 * GET 请求方法
 * @param url 请求的 URL 路径
 * @param options 请求选项
 * @param otherOptions 额外的配置选项
 * @returns Promise<T> 返回响应数据
 */
export const get = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions,
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "GET" }),
    otherOptions,
  );
};

/**
 * POST 请求方法
 * @param url 请求的 URL 路径
 * @param options 请求选项（包含 body 数据）
 * @param otherOptions 额外的配置选项
 * @returns Promise<T> 返回响应数据
 */
export const post = <T>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions,
) => {
  return request<T>(
    url,
    Object.assign({}, options, { method: "POST" }),
    otherOptions,
  );
};
