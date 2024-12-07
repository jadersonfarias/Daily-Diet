import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body
      );

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      });

      return reply.status(201).send();
    }
  );

  ///

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const meals = await knex("meals")
        .where({ user_id: req.user?.id })
        .orderBy("date", "desc");

      return {
        meals,
      };
    }
  );

  ///

  app.put(
    "/:mealsId",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const paramsSchema = z.object({ mealsId: z.string().uuid() });

      const { mealsId } = paramsSchema.parse(req.params);

      const updateMealsBodyShemas = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      });

      const { date, description, isOnDiet, name } = updateMealsBodyShemas.parse(
        req.body
      );

      const meal = await knex("meals").where({ id: mealsId }).first();

      if (!meal) {
        return reply.status(404).send({ error: "Meal not found" });
      }

      await knex("meals").where({ id: mealsId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      });

      return reply.status(204).send();
    }
  );

  ///

  app.delete(
    "/:mealsId",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const paramsSchema = z.object({ mealsId: z.string().uuid() });

      const { mealsId } = paramsSchema.parse(req.params);

      const meal = await knex("meals").where({ id: mealsId }).first();

      if (!meal) {
        return reply.status(404).send({ error: "Meal not found" });
      }

      await knex("meals").where({ id: mealsId }).delete();

      return reply.status(204).send();
    }
  );

  ///

  app.get(
    "/metrics",
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
       const totalMealsOnDiet = await knex('meals')
        .where({ user_id: req.user?.id,  is_on_diet: true})
        .count('id', { as: 'total'})
        .first()

        const  totalMealsOffDiet = await knex('meals')
        .where({ user_id: req.user?.id, is_on_diet: false })
        .count('id', { as: 'total' })
        .first()

        const totalMeals = await knex('meals')
        .where({ user_id: req.user?.id })
        .orderBy('date', 'desc')

        const { bestOnDietSequence } = totalMeals.reduce(
          (acc, meal) => {
            if (meal.is_on_diet) {
              acc.currentSequence += 1
            } else {
              acc.currentSequence = 0
            }
  
            if (acc.currentSequence > acc.bestOnDietSequence) {
              acc.bestOnDietSequence = acc.currentSequence
            }
  
            return acc
          },
          { bestOnDietSequence: 0, currentSequence: 0 },
        )

        return reply.status(200).send({
          totalMeals: totalMeals.length,
          totalMealsOnDiet: totalMealsOnDiet?.total,
          totalMealsOffDiet: totalMealsOffDiet?.total,
          bestOnDietSequence,
        })
    }

  );
}
