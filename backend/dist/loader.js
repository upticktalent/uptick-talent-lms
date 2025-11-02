"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadServices = void 0;
const config_1 = require("./config");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const routes_1 = __importDefault(require("./routes"));
const servicesLoader = [
    {
        path: (0, utils_1.joinUrls)(constants_1.constants.urls.health.entry().path),
        handler: [routes_1.default.health],
    },
];
const loadServices = (app) => {
    servicesLoader.map((service) => {
        console.log(service.path);
        app.use(service.path, ...service.handler);
    });
    app.use("*", (...rest) => {
        (0, utils_1.responseObject)({
            res: rest[1],
            message: config_1.getters.geti18ns().LOGS.ROUTES.WILDCARD,
            statusCode: config_1.HttpStatusCode.NOT_FOUND,
        });
    });
};
exports.loadServices = loadServices;
