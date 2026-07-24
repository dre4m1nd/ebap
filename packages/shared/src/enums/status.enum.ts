export const CommonStatus = {
  DISABLED: 0,
  ACTIVE: 1,
} as const;

export type CommonStatus = (typeof CommonStatus)[keyof typeof CommonStatus];
