import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db/prisma.js";

/**
 * @desc   Create Order
 * @route  api/ordersddress
 * @method POST
 * @access private
 */
export const createOrderCtrl = asyncHandler(async(req:Request, res:Response) => {
  return await prismaClient.$transaction(async(tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        id: req.user?.id
      },
      include: {
        product: true
      }
    });

    if(cartItems.length === 0) {
      res.status(404).json({ message: "Cart is empty" });
      return;
    }

    const price = cartItems.reduce((prev, curr) => {
      return prev + (curr.quantity * +curr.product.price);
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user?.defaultShippingAddress!
      }
    });
    
    const order = await tx.order.create({
      data: {
        userId: req.user?.id!,
        netAmount: price,
        address: address?.formattedAddress!,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity
            }
          })
        }
      }
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      }
    });

    await tx.cartItem.deleteMany({
      where: {
        id: req.user?.id
      }
    });

    res.status(201).json(order);
  });
});

/**
 * @desc   List Orders
 * @route  api/orders
 * @method GET
 * @access private
 */
export const listOrdersCtrl = asyncHandler(async(req:Request, res:Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user?.id
    }
  });

  res.status(200).json(orders);
});

/**
 * @desc   Cancel Order
 * @route  api/orders/:id/cancel
 * @method PUT
 * @access private
 */
export const cancelOrderCtrl = asyncHandler(async(req:Request, res:Response) => {
  return await prismaClient.$transaction(async(tx) => {
    try {
      const order = await tx.order.update({
        where: {
          id: +req.params.id,
          userId: req.user?.id
        },
        data: {
          status: "CANCELED"
        }
      });
  
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELED"
        }
      });
  
      res.status(200).json(order);
    } catch (error) {
      throw createError(404, "Order not found");
    }
  })
});

/**
 * @desc   Get Order By Id
 * @route  api/orders/:id
 * @method GET
 * @access private
 */
export const getOrderByIdCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id
      },
      include: {
        products: true,
        events: true
      }
    });

    res.status(200).json(order);
  } catch (error) {
    throw createError(404, "Order not found");
  }
});

/**
 * @desc   List All Orders
 * @route  api/orders/index
 * @method GET
 * @access private(admin only)
 */
export const listAllOrdersCtrl = asyncHandler(async(req:Request, res:Response) => {
  let whereClause = {};
  const status = req.query.status;
  if(status) {
    whereClause = {
      status
    }
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5
  });

  res.status(200).json(orders);
});

/**
 * @desc   Change Order Status
 * @route  api/orders/:id/status
 * @method PUT
 * @access private(admin only)
 */
export const changeStatusCtrl = asyncHandler(async(req:Request, res:Response) => {
  return await prismaClient.$transaction(async(tx) => {
    try {
      const order = await tx.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status
        }
      });
  
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status
        }
      });
  
      res.status(200).json(order);
    } catch (error) {
      throw createError(404, "Order not found");
    }
  })
});

/**
 * @desc   List All Orders
 * @route  api/orders/users/:id
 * @method GET
 * @access private(admin only)
 */
export const ListUserOrdersCtrl = asyncHandler(async(req:Request, res:Response) => {
  let whereClause: any = {
    userId: +req.params.id
  };
  const status = req.query.status;
  if(status) {
    whereClause = {
      ...whereClause,
      status
    }
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: +req.query.skip! || 0,
    take: 5
  });

  res.status(200).json(orders);
});