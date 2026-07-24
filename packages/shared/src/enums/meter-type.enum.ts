export const MeterType = {
  LIGHT: 1,
  AIR: 2,
} as const;

export type MeterType = (typeof MeterType)[keyof typeof MeterType];
