export let apiUriPrefix = "";

if (process.env.NEXT_PUBLIC_API_PREFIX) {
  apiUriPrefix = process.env.NEXT_PUBLIC_API_PREFIX;
} else {
  apiUriPrefix = "http://localhost:8080";
}

export const API_URI_PREFIX: string = apiUriPrefix;
