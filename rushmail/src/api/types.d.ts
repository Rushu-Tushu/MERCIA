import "hono";

declare module "hono" {
  interface ContextVariableMap {
    user: any;
    session: any;
  }
}
