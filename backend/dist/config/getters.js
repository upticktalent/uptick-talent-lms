"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getters = void 0;
const constants_1 = require("../constants");
const dynamicEnv_1 = require("./dynamicEnv");
const getCurrentLanguage = () => {
    if (!dynamicEnv_1.env.CURRENT_LANGUAGE) {
        return constants_1.constants.defaults.currentLanguage;
    }
    return dynamicEnv_1.env.CURRENT_LANGUAGE;
};
const geti18ns = () => {
    return constants_1.constants.i18n[getCurrentLanguage()];
};
const getNodeEnv = () => {
    if (!dynamicEnv_1.env.NODE_ENV) {
        return constants_1.constants.defaults.environment;
    }
    return dynamicEnv_1.env.NODE_ENV;
};
const getAppPort = () => {
    if (!dynamicEnv_1.env.APP_PORT) {
        return constants_1.constants.defaults.appPort;
    }
    return parseInt(dynamicEnv_1.env.APP_PORT);
};
const getDatabaseUri = () => {
    return dynamicEnv_1.env.DATABASE_URI;
};
const getAllowedOrigins = () => {
    return dynamicEnv_1.env.ALLOWED_ORIGINS;
};
exports.getters = {
    geti18ns,
    getCurrentLanguage,
    getNodeEnv,
    getAppPort,
    getDatabaseUri,
    getAllowedOrigins,
};
