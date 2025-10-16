import { Router } from "express";
import authRoutes from "./authRoute.js";
import productsRoutes from "./productsRoute.js";
import usersRoutes from "./usersRoute.js";
import cartRoutes from "./cartRoute.js";
import ordersRoutes from "./ordersRoute.js";

const rootRouter:Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/orders', ordersRoutes);

export default rootRouter;