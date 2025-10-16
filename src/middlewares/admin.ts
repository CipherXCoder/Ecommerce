import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if(user?.role === "ADMIN") {
    next()
  } else {
    next(createError(401, 'Unauthorized!'));
  }
}