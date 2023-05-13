import { Router } from "express";
import { userController } from "../controllers";
import { validateMiddleware } from "../middleware";
import { userSchema } from "../types";

const router = Router();

router
  .route("/users")
  .get(userController.list)
  .post(validateMiddleware(userSchema, { isArray: true }), userController.bulkCreate);

router.route("/user").post(validateMiddleware(userSchema), userController.create);

router
  .route("/user/:id")
  .get(userController.get)
  .put(validateMiddleware(userSchema), userController.update)
  .delete(userController.delete);

export default router;
