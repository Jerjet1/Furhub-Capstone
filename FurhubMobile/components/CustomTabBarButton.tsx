import { TouchableOpacity } from "react-native";

const CustomTabBarButton = (props: any) => {
  return (
    <TouchableOpacity activeOpacity={1} {...props}>
      {props.children}
    </TouchableOpacity>
  );
};
export default CustomTabBarButton;
