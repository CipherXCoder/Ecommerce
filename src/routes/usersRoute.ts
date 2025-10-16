import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from '../middlewares/validate.js';
import { addressSchema, changeUserRoleSchema, updateUserSchema } from '../schema/userSchema.js';
import {
  addAddressCtrl,
  changeUserRoleCtrl,
  deleteAddressCtrl,
  getUserByIdCtrl,
  listAddressesCtrl,
  listUsersCtrl,
  updateUserCtrl
} from "../controllers/usersController.js";
import { adminMiddleware } from "../middlewares/admin.js";

const usersRoutes:Router = Router();

usersRoutes.use(authMiddleware);

usersRoutes.route("/address")
          .get(listAddressesCtrl)
          .post(validate(addressSchema), addAddressCtrl);

usersRoutes.delete("/address/:id", deleteAddressCtrl);

usersRoutes.route("/")
          .put(validate(updateUserSchema), updateUserCtrl)
          .get(adminMiddleware, listUsersCtrl);

usersRoutes.put("/:id/role", adminMiddleware, validate(changeUserRoleSchema), changeUserRoleCtrl);

usersRoutes.get("/:id", adminMiddleware, getUserByIdCtrl);

export default usersRoutes;