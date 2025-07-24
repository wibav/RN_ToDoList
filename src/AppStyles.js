import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const AppStyles = {
  color: {
    primary: "#1e80c5ff",
    azulSecundario: "#003B7A",
    main: "#5ea23a",
    text: "#696969",
    title: "#464646",
    subtitle: "#545454",
    tint: "#97D700",
    description: "#bbbbbb",
    white: "white",
    black: "black",
    grey: "grey",
    greenBlue: "#00aea8",
    placeholder: "#a0a0a0",
    background: "#f2f2f2",
    blue: "#3293fe",
    red: '#FF6B35',
  },
  fontSize: {
    title: width * 0.07,
    content: width * 0.04,
    normal: width * 0.035,
  },
  buttonWidth: {
    main: "70%",
  },
  textInputWidth: {
    main: "80%",
  },
  borderRadius: {
    main: width * 0.08,
    small: width * 0.02,
  },
  size: {
    width: width,
    height: height,
  },
};

export const theme = {
  colors: {
    primary: AppStyles.color.primary,
    accent: AppStyles.color.tint,
    background: AppStyles.color.background,
    surface: AppStyles.color.white,
    text: AppStyles.color.text,
  },
};