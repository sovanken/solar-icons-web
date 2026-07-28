export const SIZE_PRESETS = [20, 24, 32, 48, 64, 80] as const;
export type SizePreset = (typeof SIZE_PRESETS)[number];
