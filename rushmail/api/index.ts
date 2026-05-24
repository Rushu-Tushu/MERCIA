import { handle } from "hono/vercel";
import app from "../src/api";

export const runtime = "edge";

export default handle(app);
