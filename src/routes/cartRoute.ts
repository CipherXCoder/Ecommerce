import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { addItemToCartCtrl, changeQuantityCtrl, deleteItemFromCartCtrl, getCartCtrl } from "../controllers/cartController.js";
import { validate } from "../middlewares/validate.js";
import { cartSchema, changeQuantitySchema } from "../schema/cartSchema.js";

const cartRoutes:Router = Router();

cartRoutes.use(authMiddleware);

cartRoutes.route("/")
          .post(validate(cartSchema), addItemToCartCtrl)
          .get(getCartCtrl)
          
cartRoutes.route("/:id")
          .delete(deleteItemFromCartCtrl)
          .put(validate(changeQuantitySchema), changeQuantityCtrl)

export default cartRoutes;