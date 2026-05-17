import { expect } from "@std/expect";
import { Effect, Either } from "effect";
import { createActor, toPromise } from "xstate";
import { logic_from_declared_effect } from "./src/lib/logic_from_declared_effect.ts";

type Ctx = {
    Actor: {
        greet: (name: string) => Effect.Effect<string, string>;
    };
};

const logic = logic_from_declared_effect<Ctx>("greet");

Deno.test("logic_from_declared_effect", async (t) => {
    await t.step("wraps success in Either.Right", async () => {
        const actor = createActor(logic, {
            input: [
                {
                    Actor: {
                        greet: (name) => Effect.succeed(`Hello, ${name}!`),
                    },
                },
                "world",
            ],
        });
        actor.start();
        const result = await toPromise(actor);
        expect(Either.isRight(result)).toBe(true);
        if (Either.isRight(result)) {
            expect(result.right).toBe("Hello, world!");
        }
    });

    await t.step("wraps controlled failure in Either.Left", async () => {
        const actor = createActor(logic, {
            input: [
                {
                    Actor: {
                        greet: (_name) => Effect.fail("name is forbidden"),
                    },
                },
                "forbidden",
            ],
        });
        actor.start();
        const result = await toPromise(actor);
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe("name is forbidden");
        }
    });

    await t.step("panics (throws) go to onError — actor rejects", async () => {
        const actor = createActor(logic, {
            input: [
                {
                    Actor: {
                        greet: (_name) =>
                            Effect.sync(() => {
                                throw new Error("panic!");
                            }),
                    },
                },
                "boom",
            ],
        });
        actor.start();
        await expect(toPromise(actor)).rejects.toThrow();
    });
});
