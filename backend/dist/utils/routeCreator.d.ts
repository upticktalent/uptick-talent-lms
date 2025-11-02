import type { HttpMethod } from "../types";
export declare const routeCreator: (path: string, method?: HttpMethod) => {
    path: string;
    method: HttpMethod;
};
