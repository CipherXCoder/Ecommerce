import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/secrets.js";
import { prismaClient } from "../db/prisma.js";
import { User } from "@prisma/client";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Unauthorized!'));
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

    if (!user) return next(createError(401, 'Unauthorized!'));

    req.user = user as User;
    next();
  } catch (error) {
    return next(createError(401, 'Unauthorized!'));
  }
}