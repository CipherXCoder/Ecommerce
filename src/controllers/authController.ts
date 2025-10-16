import { Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "express-async-handler";
import { prismaClient } from "../db/prisma.js";
import { compareSync, hashSync }  from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/secrets.js";

/**
 * @desc   SignUp a new user
 * @route  api/auth/singup
 * @method POST
 * @access public
 */
export const signUpCtrl = asyncHandler(async (req:Request, res:Response) => {
  const { name, email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw createError(400, "User already exists!");
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10)
    }
  });

  res.status(201).json(user);
});

/**
 * @desc   Login a user
 * @route  api/auth/login
 * @method POST
 * @access public
 */
export const loginCtrl = asyncHandler(async (req:Request, res:Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw createError(400, "Invalid Credentials!");
  }

  if(!compareSync(password, user!.password)) {
    throw createError(400, "Invalid Credentials!");
  }

  const token = jwt.sign({ userId: user!.id }, JWT_SECRET);

  res.status(200).json({ user, token });
});

/**
 * @desc   Get Logged in user
 * @route  api/auth/me
 * @method GET
 * @access private(only Logged in User)
 */
export const meCtrl = asyncHandler(async (req:Request, res:Response) => {
  res.status(200).json(req.user);
});
