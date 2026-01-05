import { createOryMiddleware } from "@ory/nextjs/middleware";

import oryConfig from "@/ory.config";

// This function can be marked `async` if using `await` inside
// export const proxy = createOryMiddleware(oryConfig);
export const proxy = ()=>{}

// See "Matching Paths" below to learn more
export const config = {};
