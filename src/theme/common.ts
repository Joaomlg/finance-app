const text = {
  heading: 24,
  title: 16,
  default: 14,
  small: 12,
  extraSmall: 10,
};

const font = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  bold: 'Inter_700Bold',
};

const typography = {
  default: {
    fontFamily: font.regular,
    fontSize: text.default,
  },
  defaultBold: {
    fontFamily: font.bold,
    fontSize: text.default,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: text.heading,
  },
  headingRegular: {
    fontFamily: font.regular,
    fontSize: text.heading,
  },
  title: {
    fontFamily: font.bold,
    fontSize: text.title,
  },
  light: {
    fontFamily: font.light,
    fontSize: text.small,
  },
  lightBold: {
    fontFamily: font.bold,
    fontSize: text.small,
  },
  extraLight: {
    fontFamily: font.light,
    fontSize: text.extraSmall,
  },
};

export default {
  text,
  font,
  typography,
};
