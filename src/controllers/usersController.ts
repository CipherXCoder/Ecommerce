import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db/prisma.js";
import { Address } from "@prisma/client";

/**
 * @desc   Add new address
 * @route  api/users/address
 * @method POST
 * @access private
 */
export const addAddressCtrl = asyncHandler(async(req:Request, res:Response) => {
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user?.id
    }
  });

  res.status(201).json(address);
})

/**
 * @desc   List all addresses
 * @route  api/users/address
 * @method GET
 * @access private
 */
export const listAddressesCtrl = asyncHandler(async(req:Request, res:Response) => {
  const addresses = await prismaClient.address.findMany({
    where: { userId: req.user?.id }
  });

  res.status(200).json(addresses);
})

/**
 * @desc   Delete an address
 * @route  api/users/address/:id
 * @method DELETE
 * @access private
 */
export const deleteAddressCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
      await prismaClient.address.delete({ where: { id: +req.params.id }});
  
      res.status(200).json({
        status: true,
        message: "Address deleted successfully"}
      );
    } catch (error) {
      throw createError(404, "Address not found!");
    }
})

/**
 * @desc   Update User
 * @route  api/users
 * @method PUT
 * @access private
 */
export const updateUserCtrl = asyncHandler(async(req:Request, res:Response) => {
  let shippingAddress: Address;
  let billingAddress: Address;

  if(req.body.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: req.body.defaultShippingAddress }
      });
    } catch (error) {
      throw createError(404, "Address not found!");
    }

    if(shippingAddress.userId !== req.user?.id) {
        throw createError(400, "Address does not belong to user!");
      }
  }
  
  if(req.body.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: req.body.defaultBillingAddress }
      });
    } catch (error) {
      throw createError(404, "Address not found!");
    }

    if(billingAddress.userId !== req.user?.id) {
        throw createError(400, "Address does not belong to user!");
      }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user?.id },
    data: req.body
  })

  res.status(200).json(updatedUser);
})

/**
 * @desc   List All Users
 * @route  api/users
 * @method get
 * @access private(admin only)
 */
export const listUsersCtrl = asyncHandler(async(req:Request, res:Response) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip! || 0,
    take: 5
  });

  res.status(200).json(users);
})

/**
 * @desc   Get User By Id
 * @route  api/users/:id
 * @method get
 * @access private(admin only)
 */
export const getUserByIdCtrl = asyncHandler(async(req:Request, res:Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id
      },
      include: {
        addresses: true
      }
    });

    res.status(200).json(user);
  } catch (error) {
    throw createError(404, "User Not Found!");
  }
})

/**
 * @desc   Change User Role
 * @route  api/users/:id/role
 * @method put
 * @access private(admin only)
 */
export const changeUserRoleCtrl = asyncHandler(async(req:Request, res:Response) => {
    try {
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id
      },
      data: {
        role: req.body.role
      }
    });

    res.status(200).json(user);
  } catch (error) {
    throw createError(404, "User Not Found!");
  }
})