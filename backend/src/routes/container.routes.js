import express from "express";

import { protect }
from "../middleware/auth.middleware.js";

import {
    createContainer,
    getMyContainers
}
from "../controllers/container.controller.js";

const router =
    express.Router();

router.post(
    "/create",
    protect,
    createContainer
);
router.get(
    "/my",
    protect,
    getMyContainers
);

export default router;