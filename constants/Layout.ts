import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375
};

const basicSizes = {
  small: 4,
  normal: 8, 
  large: 12,
  veryLarge: 16
}

export const paddings = basicSizes

export const margins = basicSizes

export const borderRadiuses = basicSizes