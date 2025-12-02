/**
 * HTTP 客户端模块
 * 基于 ky 封装的 HTTP 客户端，提供请求/响应拦截、错误处理等功能
 */
import type { IOtherOptions } from "./base";
import type {
  AfterResponseHook,
  BeforeErrorHook,
  BeforeRequestHook,
  Hooks,
} from "ky";

import { toast } from "sonner";
import ky from "ky";

import { API_URI_PREFIX } from "@/config/path";

/** 请求超时时间（毫秒） */
const TIME_OUT = 100000;

/**
 * 响应错误数据结构
 */
export type ResponseError = {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** HTTP 状态码 */
  status: number;
};

/**
 * 请求选项类型
 */
export type FetchOptionType = Omit<RequestInit, "body"> & {
  /** URL 查询参数 */
  params?: Record<string, any>;
  /** 请求体数据 */
  body?: BodyInit | Record<string, any> | null;
};

/**
 * 常用的 Content-Type 类型
 */
export const ContentType = {
  /** JSON 格式 */
  json: "application/json",
  /** 流式数据 */
  stream: "text/event-stream",
  /** 音频文件 */
  audio: "audio/mpeg",
  /** 表单数据 */
  form: "application/x-www-form-urlencoded; charset=UTF-8",
  /** 下载文件 */
  download: "application/octet-stream",
  /** ZIP 压缩包下载 */
  downloadZip: "application/zip",
  /** 文件上传 */
  upload: "multipart/form-data",
};

/**
 * 基础请求配置
 */
export const baseOptions: RequestInit = {
  method: "GET",
  mode: "cors",
  credentials: "include", // 始终发送 cookies 和 HTTP Basic 认证信息
  headers: new Headers({
    "Content-Type": ContentType.json,
  }),
  redirect: "follow",
};

/**
 * 响应后错误处理钩子
 * 处理非 2xx/3xx 的响应，显示错误提示
 * @param otherOptions 额外选项
 * @returns AfterResponseHook 响应钩子函数
 */
const afterResponseErrorCode = (
  otherOptions: IOtherOptions,
): AfterResponseHook => {
  return async (_request, _options, response) => {
    const clonedResponse = response.clone();

    // 检查是否为非成功状态码
    if (!/^([23])\d{2}$/.test(String(clonedResponse.status))) {
      const bodyJson = clonedResponse.json() as Promise<ResponseError>;

      switch (clonedResponse.status) {
        case 403:
          // 403 权限不足，显示错误但不中断
          bodyJson.then((data: ResponseError) => {
            if (!otherOptions.silent) toast.error(data.message);
          });
          break;
        case 401:
          // 401 未授权，交给上层处理（可能触发刷新令牌）
          return Promise.reject(response);
        default:
          // 其他错误状态码，显示错误并拒绝
          bodyJson.then((data: ResponseError) => {
            if (!otherOptions.silent) toast.error(data.message);
          });

          return Promise.reject(response);
      }
    }
  };
};

/**
 * 请求错误处理钩子
 * 显示错误提示（如网络错误、超时等）
 * @param otherOptions 额外选项
 * @returns BeforeErrorHook 错误钩子函数
 */
const beforeErrorToast = (otherOptions: IOtherOptions): BeforeErrorHook => {
  return (error) => {
    if (!otherOptions.silent) toast.error(error.message);

    return error;
  };
};

/**
 * 处理 204 No Content 响应
 * 将空响应转换为包含 result 字段的 JSON
 */
const afterResponse204: AfterResponseHook = async (
  _request,
  _options,
  response,
) => {
  if (response.status === 204) return Response.json({ result: "success" });
};

/**
 * 从 cookie 中获取访问令牌
 * @returns 访问令牌字符串，如果不存在则返回空字符串
 */
export function getAccessToken() {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("access_token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}

/**
 * 从 cookie 中获取刷新令牌
 * @returns 刷新令牌字符串，如果不存在则返回空字符串
 */
export function getRefreshToken() {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) =>
    c.trim().startsWith("refresh_token="),
  );

  return tokenCookie ? tokenCookie.split("=")[1] : "";
}

/**
 * 公共接口请求前添加授权头
 * 用于需要认证但不是 API 路径的请求
 */
const beforeRequestPublicAuthorization: BeforeRequestHook = (request) => {
  const token = getAccessToken();

  request.headers.set("Authorization", `Bearer ${token}`);
};

/**
 * API 请求前添加授权头
 * 为所有 API 请求添加 Bearer token
 */
const beforeRequestAuthorization: BeforeRequestHook = (request) => {
  const accessToken = getAccessToken();

  request.headers.set("Authorization", `Bearer ${accessToken}`);
};

/**
 * 基础钩子配置
 */
const baseHooks: Hooks = {
  afterResponse: [afterResponse204],
};

/**
 * HTTP 客户端实例
 * 基于 ky 创建，配置了基础钩子和超时时间
 */
const httpClient = ky.create({
  hooks: baseHooks,
  timeout: TIME_OUT,
});

/**
 * 基础请求方法
 * 所有 HTTP 请求的底层实现，包含完整的钩子配置和响应处理
 * @param url 请求的 URL 路径
 * @param options 请求选项
 * @param otherOptions 额外配置选项
 * @returns Promise<T> 返回解析后的响应数据
 */
export async function base<T>(
  url: string,
  options: FetchOptionType = {},
  otherOptions: IOtherOptions = {},
): Promise<T> {
  const { params, body, headers, ...init } = Object.assign(
    {},
    baseOptions,
    options,
  );
  const {
    isAuthURL = false,
    bodyStringify = true,
    needAllResponseContent,
    deleteContentType,
    getAbortController,
  } = otherOptions;

  let base: string = API_URI_PREFIX;

  // 设置请求取消控制器
  if (getAbortController) {
    const abortController = new AbortController();

    getAbortController(abortController);
    options.signal = abortController.signal;
  }

  // 构建完整的请求路径
  const fetchPathname = base + (url.startsWith("/") ? url : `/${url}`);

  // 删除 Content-Type 头（用于文件上传等场景）
  if (deleteContentType) (headers as any).delete("Content-Type");

  // 根据 URL 类型选择授权钩子
  const authHook = isAuthURL
    ? beforeRequestPublicAuthorization
    : beforeRequestAuthorization;

  // 扩展 HTTP 客户端，添加自定义钩子
  const client = httpClient.extend({
    hooks: {
      ...baseHooks,
      beforeError: [
        ...(baseHooks.beforeError || []),
        beforeErrorToast(otherOptions),
      ],
      beforeRequest: [...(baseHooks.beforeRequest || []), authHook],
      afterResponse: [
        ...(baseHooks.afterResponse || []),
        afterResponseErrorCode(otherOptions),
      ],
    },
  });

  // 发起请求
  const res = await client(fetchPathname, {
    ...init,
    headers,
    retry: { methods: [] }, // 禁用重试
    ...(bodyStringify ? { json: body } : { body: body as BodyInit }),
    searchParams: params,
    fetch(resource: RequestInfo | URL, options?: RequestInit) {
      // 合并请求头
      if (resource instanceof Request && options) {
        const mergedHeaders = new Headers(options.headers || {});

        resource.headers.forEach((value, key) => {
          mergedHeaders.append(key, value);
        });
        options.headers = mergedHeaders;
      }

      return globalThis.fetch(resource, options);
    },
  });

  // 返回完整响应（包括 headers）
  if (needAllResponseContent) return res as T;

  const contentType = res.headers.get("content-type");

  // 根据 Content-Type 处理响应
  if (
    contentType &&
    [ContentType.download, ContentType.audio, ContentType.downloadZip].includes(
      contentType,
    )
  )
    return (await res.blob()) as T;

  // 默认返回 JSON 数据
  return (await res.json()) as T;
}
