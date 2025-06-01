import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;

export const RFPercentage = (percent) => {
  const standardScreenHeight = 680; // Chiều cao màn hình thiết bị chuẩn (ví dụ iPhone 6/7/8)
  const scale = height / standardScreenHeight;
  return Math.round(percent * scale);
};