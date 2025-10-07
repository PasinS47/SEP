import { password } from "bun";
import { Elysia ,t} from "elysia";
import { openapi } from '@elysiajs/openapi';
import {signin_hadle} from "./hadler"

const app = new Elysia({prefix:"/api"})
  .use(openapi())
  .post("/signin", ({body:{username,password}}) => signin_hadle(username,password),{body:t.Object({username:t.String(),password:t.String()})})
  .get("/signup", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
