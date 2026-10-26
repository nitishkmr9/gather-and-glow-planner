import { describe, it, expect } from "vitest";
import { footprint } from "@/lib/carbon";
describe("footprint", () => {
  it("sums yearly parts", () => {
    const r = footprint({ carKm: 100, flights: 1, kwh: 0, meatMeals: 0, shopping: 0 });
    expect(Math.round(r.parts.carKm)).toBe(884);
    expect(r.total).toBeCloseTo(884 + 250);
  });
});
