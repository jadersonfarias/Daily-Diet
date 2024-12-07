import fastify from "fastify";

import { env } from "./env";
import { usersRoutes } from "./routes/users.routes";
import cookie from '@fastify/cookie'
import { mealsRoutes } from "./routes/meals.routes";

const app = fastify();

app.register(cookie)

app.register(mealsRoutes, {prefix: 'meals'})
app.register(usersRoutes, { prefix: "users" });

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
