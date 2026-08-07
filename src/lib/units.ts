import type { WeightUnit } from "@/lib/types";

const KG_PER_LB = 0.45359237;

/** Weight entries are always stored in kg; convert only for display/input. */
export function kgToUnit(kg: number, unit: WeightUnit): number {
  return unit === "lbs" ? Math.round((kg / KG_PER_LB) * 10) / 10 : Math.round(kg * 10) / 10;
}

export function unitToKg(value: number, unit: WeightUnit): number {
  return unit === "lbs" ? Math.round(value * KG_PER_LB * 100) / 100 : value;
}
