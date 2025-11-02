"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urls = void 0;
const utils_1 = require("../utils");
exports.urls = {
    health: {
        entry: () => (0, utils_1.routeCreator)("health"),
        root: () => "/", // optional, for clarity
        detailed: () => "/detailed",
        liveness: () => "/liveness",
        readiness: () => "/readiness",
    },
    features: {
        getByFlag: () => (0, utils_1.routeCreator)("flags"),
        getAll: () => (0, utils_1.routeCreator)("all"),
    },
};
