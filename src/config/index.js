import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const basePx = 375;

function px(size) {
  if (width > 500) {
    return (size * 450) / basePx;
  }
  return (size * width) / basePx;
}
export { px };
