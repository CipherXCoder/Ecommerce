import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db/prisma.js";

/**
 * @desc   Create new products
 * @route  api/products
 * @method POST
 * @access private(only ADMIN)
 */
export const createProductCtrl = asyncHandler(async(req:Request, res:Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(',')
    }
  })

  res.status(201).json(product);
});

/**
 * @desc   Update product
 * @route  api/products/:id
 * @method PUT
 * @access private(only ADMIN)
 */
export const updateProductCtrl = asyncHandler(async(req:Request, res:Response) => {
  const product = req.body;

  if(product.tags) {
    product.tags = product.tags.join(",");
  }

  try {
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id
      },
      data: product
    })

    res.status(200).json(updatedProduct);
  } catch (error) {
    throw createError(404, "Product not found!");
  }
});

/**
 * @desc   Delete product
 * @route  api/products/:id
 * @method DELETE
 * @access private(only ADMIN)
 */
export const deleteProductCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    await prismaClient.product.delete({ where: { id: +req.params.id }});

    res.status(200).json({
      status: true,
      message: "Product deleted successfully"}
    );
  } catch (error) {
    throw createError(404, "Product not found!");
  }
});

/**
 * @desc   list products
 * @route  api/products
 * @method GET
 * @access private(only ADMIN)
 */
export const listProductsCtrl = asyncHandler(async(req:Request, res:Response) => {
  const count = await prismaClient.product.count();

  const products = await prismaClient.product.findMany({
    skip: +req.query.skip! || 0,
    take: 5
  })

  res.status(200).json({
    count,
    data: products
  })
});

/**
 * @desc   Get product by id
 * @route  api/products/:id
 * @method GET
 * @access private(only ADMIN)
 */
export const getProductByIdCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({ where: { id: +req.params.id }});

    res.status(200).json(product);
  } catch (error) {
    throw createError(404, "Product not found!");
  }
});

/**
 * @desc   Search products
 * @route  api/products/search
 * @method GET
 * @access private
 */
export const seachProductsCtrl = asyncHandler(async(req:Request, res:Response) => {
  const products = await prismaClient.product.findMany({
    where: {
      name: {
        search: req.query.q?.toString()
      },
      description: {
        search: req.query.q?.toString()
      },
      tags: {
        search: req.query.q?.toString()
      }
    },
    skip: +req.query.skip! || 0,
    take: 5
  });

  res.status(200).json(products);
});