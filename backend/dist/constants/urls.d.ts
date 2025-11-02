export declare const urls: {
    health: {
        entry: () => {
            path: string;
            method: import("../types").HttpMethod;
        };
        root: () => string;
        detailed: () => string;
        liveness: () => string;
        readiness: () => string;
    };
    features: {
        getByFlag: () => {
            path: string;
            method: import("../types").HttpMethod;
        };
        getAll: () => {
            path: string;
            method: import("../types").HttpMethod;
        };
    };
};
