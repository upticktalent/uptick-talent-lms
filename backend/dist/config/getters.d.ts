export declare const getters: {
    geti18ns: () => {
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
    getCurrentLanguage: () => "en";
    getNodeEnv: () => "staging" | "production" | "development";
    getAppPort: () => number;
    getDatabaseUri: () => string;
    getAllowedOrigins: () => string;
};
