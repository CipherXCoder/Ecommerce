import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { cancelOrderCtrl, changeStatusCtrl, createOrderCtrl, getOrderByIdCtrl, listAllOrdersCtrl, listOrdersCtrl, ListUserOrdersCtrl } from "../controllers/ordersController.js";
import { adminMiddleware } from "../middlewares/admin.js";

const ordersRoutes:Router = Router();

ordersRoutes.use(authMiddleware);

ordersRoutes.route("/")
          .post(createOrderCtrl)
          .get(listOrdersCtrl);
          
ordersRoutes.put("/:id/cancel", cancelOrderCtrl);

ordersRoutes.get("/index", adminMiddleware, listAllOrdersCtrl);

ordersRoutes.get("/users/:id", adminMiddleware, ListUserOrdersCtrl);

ordersRoutes.put("/:id/status", adminMiddleware, changeStatusCtrl);

ordersRoutes.get("/:id", getOrderByIdCtrl);

export default ordersRoutes;