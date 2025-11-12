import type { HttpMethod } from "../types";

export const routeCreator = (path: string, method: HttpMethod = "get") => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return {
    path: normalizedPath,
  method,
  };
};
