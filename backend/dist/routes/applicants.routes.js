"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicants__controller_1 = require("../controllers/applicants..controller");
const router = (0, express_1.Router)();
router.post('/createApplicant', applicants__controller_1.createApplicant);
exports.default = router;
