import { handle } from "hono/vercel";
import app from "../src/api";

export default (req: any, res: any) => {
  const matchedPath = req.headers["x-matched-path"];
  if (matchedPath) {
    const urlObj = new URL(req.url, "http://localhost");
    req.url = matchedPath + urlObj.search;
  }
  return handle(app)(req, res);
};
