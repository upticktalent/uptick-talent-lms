"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const i18n_1 = require("./i18n");
const urls_1 = require("./urls");
exports.constants = {
    defaults: {
        currentLanguage: "en",
        environment: "development",
        appPort: 7000,
    },
    i18n: i18n_1.i18n,
    urls: urls_1.urls,
};
