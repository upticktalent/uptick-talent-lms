import { HttpStatusCode, getters } from "./config";
import { joinUrls, responseObject } from "./utils";
import type { Express } from "express";
import { constants } from "./constants";
import healthRoutes from "./routes/health.routes";

const servicesLoader = [
  {
    path: joinUrls(constants.urls.health.entry().path),
    handler: [healthRoutes],
  },
];

export const loadServices = (app: Express) => {
  servicesLoader.map((service) => {
    console.log(service.path);
    app.use(service.path, ...service.handler);
  });

  app.use("*", (...rest) => {
    responseObject({
      res: rest[1],
      message: getters.geti18ns().LOGS.ROUTES.WILDCARD,
      statusCode: HttpStatusCode.NOT_FOUND,
    });
  });
};
