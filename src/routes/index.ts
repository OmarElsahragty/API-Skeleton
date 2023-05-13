import { Router } from "express";
import { authorizedGuard } from "../guards";
import { validateMiddleware, errorHandlerMiddleware } from "../middleware";
import { userController } from "../controllers";
import { userSchema } from "../types";

import userRoutes from "./user.routes";

const router = Router();

router.route("/ping").get((_req, res) => res.status(200).send({ alive: true, timestamp: new Date().toISOString() }));

// ************** authentication ************** //

router.route("/register").post(validateMiddleware(userSchema), userController.create);
router.route("/authenticate").post(validateMiddleware(userSchema), userController.authenticate);

router.use(authorizedGuard);

// ****************************************** //

router.use(userRoutes);

// ****************************************** //

router.use(errorHandlerMiddleware);

export default router;
