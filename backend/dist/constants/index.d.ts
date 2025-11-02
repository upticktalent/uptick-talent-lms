export declare const constants: {
    defaults: {
        currentLanguage: string;
        environment: string;
        appPort: number;
    };
    i18n: {
        en: {
            ENVIRONMENT: {
                STAGING: string;
                PRODUCTION: string;
                DEVELOPMENT: string;
            };
            LOGS: {
                RUNNING_APP: string;
                ROUTES: {
                    HEALTH_CHECK: {
                        SUCCESS: string;
                    };
                    WILDCARD: string;
                };
            };
        };
    };
    urls: {
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
};
