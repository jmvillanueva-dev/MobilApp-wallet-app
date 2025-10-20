// components/ThemedView.tsx
import { View, type ViewProps, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors"; // Asegúrate de tener este archivo de colores
 // Asegúrate de tener este archivo de colores

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor =
    colorScheme === "dark"
      ? darkColor ?? Colors.dark.background
      : lightColor ?? Colors.light.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
