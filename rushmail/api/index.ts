/// <reference path="../src/api/types.d.ts" />
import { handle } from "hono/vercel";
import app from '../src/api/index.js';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const PATCH = handle(app);
