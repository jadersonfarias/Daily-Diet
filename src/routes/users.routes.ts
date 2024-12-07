import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const createUserBodyShema = z.object({
        name: z.string(),
        email: z.string().email()
    })

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserBodyShema.parse(req.body) // se tiver tudo certo com os dados continua se não trás um erro

    const userByEmail = await knex('users').where({email}).first() // se tiver ele trás se não cai no meu tratamento

    if (userByEmail) {
      return reply.status(400).send({message: 'User already exists'})
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    })

    return reply.status(201).send()
  });
}
