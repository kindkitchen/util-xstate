import { expect } from "@std/expect";
import { Either } from "effect";
import { is_output_right } from "./src/lib/guard_is_output_right.ts";

Deno.test("is_output_right", async (t) => {
    await t.step("returns true when output is Right", () => {
        const event = {
            type: "xstate.done.actor.test",
            output: Either.right("success"),
        };
        expect(is_output_right({ event })).toBe(true);
    });

    await t.step("returns false when output is Left", () => {
        const event = {
            type: "xstate.done.actor.test",
            output: Either.left("controlled failure"),
        };
        expect(is_output_right({ event })).toBe(false);
    });
});
