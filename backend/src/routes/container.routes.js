import express from "express";

import { protect }
from "../middleware/auth.middleware.js";

import {
    createContainer,
}
from "../controllers/container.controller.js";

const router =
    express.Router();

router.post(
    "/create",
    protect,
    createContainer
);

export default router;