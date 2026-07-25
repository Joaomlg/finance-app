const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const adjustColorLightness = (hex: string, amount: number) => {
  const normalizedHex = hex.replace('#', '');
  const num = parseInt(normalizedHex, 16);

  const r = clamp((num >> 16) + Math.round(255 * amount), 0, 255);
  const g = clamp(((num >> 8) & 0x00ff) + Math.round(255 * amount), 0, 255);
  const b = clamp((num & 0x0000ff) + Math.round(255 * amount), 0, 255);

  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
};
