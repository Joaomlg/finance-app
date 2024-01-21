export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const textCompare = (text1: string, text2: string) => {
  return text1.localeCompare(text2);
};
