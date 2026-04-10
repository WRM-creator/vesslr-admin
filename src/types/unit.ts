/**
 * Unit metadata for admin UI.
 * Mirrors frontend/src/types/unit.ts — kept in sync manually.
 */

export type MeasurementType =
  | "volume"
  | "mass"
  | "length"
  | "area"
  | "gas_volume"
  | "energy"
  | "count"
  | "time";

interface UnitMeta {
  label: string;
  short: string;
  category: MeasurementType;
}

/** All valid unit enum values with display metadata, grouped by category. */
export const UNITS: Record<string, UnitMeta> = {
  // Volume
  bbl: { label: "Barrels (Oil)", short: "bbl", category: "volume" },
  liter: { label: "Liters", short: "L", category: "volume" },
  gallon: { label: "Gallons", short: "gal", category: "volume" },
  m3: { label: "Cubic Meters", short: "m\u00b3", category: "volume" },
  // Mass
  mt: { label: "Metric Tons", short: "MT", category: "mass" },
  kg: { label: "Kilograms", short: "kg", category: "mass" },
  ton: { label: "US Short Tons", short: "ton", category: "mass" },
  lb: { label: "Pounds", short: "lb", category: "mass" },
  // Length
  m: { label: "Meters", short: "m", category: "length" },
  ft: { label: "Feet", short: "ft", category: "length" },
  // Area
  sqm: { label: "Square Meters", short: "m\u00b2", category: "area" },
  sqft: { label: "Square Feet", short: "ft\u00b2", category: "area" },
  // Gas volume
  scf: { label: "Standard Cubic Feet", short: "scf", category: "gas_volume" },
  sm3: { label: "Standard Cubic Meters", short: "Sm\u00b3", category: "gas_volume" },
  nm3: { label: "Normal Cubic Meters", short: "Nm\u00b3", category: "gas_volume" },
  // Energy
  mmbtu: { label: "Million BTU", short: "MMBtu", category: "energy" },
  kwh: { label: "Kilowatt Hours", short: "kWh", category: "energy" },
  mwh: { label: "Megawatt Hours", short: "MWh", category: "energy" },
  // Count / packaging
  unit: { label: "Units", short: "ea", category: "count" },
  set: { label: "Sets", short: "set", category: "count" },
  kit: { label: "Kits", short: "kit", category: "count" },
  pair: { label: "Pairs", short: "pr", category: "count" },
  joint: { label: "Joints", short: "jt", category: "count" },
  roll: { label: "Rolls", short: "roll", category: "count" },
  sheet: { label: "Sheets", short: "sht", category: "count" },
  box: { label: "Boxes", short: "box", category: "count" },
  pack: { label: "Packs", short: "pk", category: "count" },
  drum: { label: "Drums (200L)", short: "drum", category: "count" },
  bag: { label: "Bags", short: "bag", category: "count" },
  cylinder: { label: "Gas Cylinders", short: "cyl", category: "count" },
  ream: { label: "Reams", short: "rm", category: "count" },
  license: { label: "Licenses", short: "lic", category: "count" },
  // Time / duration
  hour: { label: "Hours", short: "hr", category: "time" },
  day: { label: "Days", short: "day", category: "time" },
  week: { label: "Weeks", short: "wk", category: "time" },
  month: { label: "Months", short: "mo", category: "time" },
  year: { label: "Years", short: "yr", category: "time" },
};

export const ALL_UNIT_VALUES = Object.keys(UNITS);

/** Measurement type labels for the batch toggle UI. */
export const MEASUREMENT_TYPE_LABELS: Record<MeasurementType, string> = {
  volume: "Volume",
  mass: "Mass / Weight",
  length: "Length",
  area: "Area",
  gas_volume: "Gas Volume",
  energy: "Energy",
  count: "Count / Packaging",
  time: "Time / Duration",
};

/** All measurement types in display order. */
export const MEASUREMENT_TYPES: MeasurementType[] = [
  "volume",
  "mass",
  "length",
  "area",
  "gas_volume",
  "energy",
  "count",
  "time",
];

/** Get all units belonging to a measurement type. */
export function unitsByCategory(category: MeasurementType): string[] {
  return Object.entries(UNITS)
    .filter(([, meta]) => meta.category === category)
    .map(([key]) => key);
}
