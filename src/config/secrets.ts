import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? 'change_me';
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'change_me';
export const TRUST_PROXY = process.env.TRUST_PROXY ?? "1";
export const ALLOWED_ORIGIN = process.env.CLIENT_DOMAIN ?? "";
export const NODE_ENV = process.env.NODE_ENV ?? "development";