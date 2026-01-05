import { orySdkUrl } from "./sdk";


/**
 * Rewrites Ory SDK URLs in JSON responses (objects, arrays, strings) with the provided proxy URL.
 *
 * If `proxyUrl` is provided, the SDK URL is replaced with the proxy URL.
 *
 * @param obj - The object to rewrite
 * @param proxyUrl - The proxy URL to replace the SDK URL with
 */
export function rewriteJsonResponse<T extends object>(
  obj: T,
  proxyUrl?: string,
): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // Recursively process each item in the array
          return [
            key,
            value
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  return rewriteJsonResponse(item, proxyUrl);
                } else if (typeof item === "string" && proxyUrl) {
                  return item.replaceAll(orySdkUrl(), proxyUrl);
                }

                return item;
              })
              .filter((item) => item !== undefined),
          ];
        } else if (typeof value === "object" && value !== null) {
          // Recursively remove undefined in nested objects
          return [key, rewriteJsonResponse(value, proxyUrl)];
        } else if (typeof value === "string" && proxyUrl) {
          // Replace SDK URL with the provided proxy URL
          return [key, value.replaceAll(orySdkUrl(), proxyUrl)];
        }

        return [key, value];
      }),
  ) as T;
}
