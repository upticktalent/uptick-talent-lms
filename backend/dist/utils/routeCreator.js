"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCreator = void 0;
const routeCreator = (path, method = "get") => ({
    path,
    method,
});
exports.routeCreator = routeCreator;
