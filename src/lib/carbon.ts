export type Habits = { carKm: number; flights: number; kwh: number; meatMeals: number; shopping: number };

// Approximate emission factors (kg CO2e)
export const FACTORS = { carKm: 0.17, flight: 250, kwh: 0.7, meatMeal: 3.3, item: 15 };

export function footprint(h: Habits) {
  const parts: Record<keyof Habits, number> = {
    carKm: h.carKm * 52 * FACTORS.carKm,
    flights: h.flights * FACTORS.flight,
    kwh: h.kwh * 12 * FACTORS.kwh,
    meatMeals: h.meatMeals * 52 * FACTORS.meatMeal,
    shopping: h.shopping * FACTORS.item,
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return { parts, total };
}
