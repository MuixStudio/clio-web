import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Middleware
 * 参考 Dify 的实现，不在 middleware 中做认证检查
 * 所有认证逻辑由客户端处理，当 API 返回 401 时触发令牌刷新
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 可以在这里添加其他中间件逻辑，比如：
  // - CSP (Content Security Policy)
  // - 防止 clickjacking (X-Frame-Options)
  // - 请求头处理等

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
