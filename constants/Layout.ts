import { Dimensions } from "react-native";

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;
export const defaultScreenPadding = 25

export default {
  window: {
    width: screenWidth,
    height: screenHeight,
  },
  isSmallDevice: screenWidth < 375,
};

const basicSizes = {
  small: 4,
  normal: 8,
  large: 12,
  veryLarge: 16,
};

export const paddings = basicSizes;

export const margins = basicSizes;

export const borderRadiuses = basicSizes;
