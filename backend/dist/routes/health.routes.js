"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_controller_1 = require("../controllers/health.controller");
const express_1 = require("express");
const urls_1 = require("../constants/urls");
const router = (0, express_1.Router)();
// Basic health check
router.get(urls_1.urls.health.root(), health_controller_1.getHealth);
// Detailed health check (includes DB status, uptime, etc.)
router.get(urls_1.urls.health.detailed(), health_controller_1.getDetailedHealth);
// Kubernetes-style probes
router.get(urls_1.urls.health.liveness(), health_controller_1.getLiveness);
router.get(urls_1.urls.health.readiness(), health_controller_1.getReadiness);
exports.default = router;
