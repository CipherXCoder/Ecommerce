import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createProductSchema } from "../schema/productSchema.js";
import { createProductCtrl, deleteProductCtrl, getProductByIdCtrl, listProductsCtrl, seachProductsCtrl, updateProductCtrl } from "../controllers/productsController.js";
import { adminMiddleware } from "../middlewares/admin.js";

const productsRoutes:Router = Router();

productsRoutes.use(authMiddleware)

productsRoutes.route("/")
              .all(adminMiddleware)
              .post(validate(createProductSchema), createProductCtrl)
              .get(listProductsCtrl);

productsRoutes.get("/search", seachProductsCtrl);

productsRoutes.route("/:id")
              .all(adminMiddleware)
              .get(getProductByIdCtrl)
              .put(updateProductCtrl)
              .delete(deleteProductCtrl);


export default productsRoutes;