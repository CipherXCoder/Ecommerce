import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db/prisma.js";
import { Product } from "@prisma/client";


/**
 * @desc   Add item to cart
 * @route  api/cart
 * @method POST
 * @access private
 */
export const addItemToCartCtrl = asyncHandler(async(req:Request, res:Response) => {
  const { productId, quantity } = req.body as { productId: number; quantity: number };

  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: { id: productId },
    });
  } catch (error) {
    throw createError(404, "Product Not Found!");
  }

  // check if cart item exists for this user and product
  const existing = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user?.id!,
      productId: product.id,
    },
  });

  if (existing) {
    // increment quantity
    const updated = await prismaClient.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity,
      },
    });
    res.status(200).json(updated);
    return;
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user?.id!,
      productId: product.id,
      quantity,
    },
  });

  res.status(201).json(cart);
});

/**
 * @desc   Delete item from cart
 * @route  api/cart/:id
 * @method DELETE
 * @access private
 */
export const deleteItemFromCartCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    const cart = await prismaClient.cartItem.findFirstOrThrow({
      where: {
        id: +req.params.id,
        userId: req.user?.id
      }
    })    
    
    await prismaClient.cartItem.delete({
      where: { id: +req.params.id }
    });
  
    res.status(200).json({
      success: true,
      message: "Item has been removed from cart"
    });
  } catch (error) {
    throw createError(404, "This item does not exist in your cart");
  }
  
});

/**
 * @desc   Change quantity
 * @route  api/cart/:id
 * @method PUT
 * @access private
 */
export const changeQuantityCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    const updatedCart = await prismaClient.cartItem.update({
      where: { id: +req.params.id, userId: req.user?.id! },
      data: {
        quantity: req.body.quantity
      }
    });
  
    res.status(200).json(updatedCart);
  } catch (error) {
    throw createError(404, "Item do not exist in your cart");
  }
});

/**
 * @desc   Get cart
 * @route  api/cart
 * @method GET
 * @access private
 */
export const getCartCtrl = asyncHandler(async(req:Request, res:Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user?.id!
    },
    include: {
      product: true
    }
  });

  res.status(200).json(cart)
});
