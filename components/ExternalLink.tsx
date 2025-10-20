// components/ExternalLink.tsx
import { Link } from "expo-router";
import { Platform } from "react-native";

export function ExternalLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...props}
      // Asegura que el enlace se abra en un navegador fuera de la app
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          // Previene el comportamiento por defecto de abrirlo en la app
          e.preventDefault();
          // Abre el enlace en el navegador del sistema
          require("expo-linking").openURL(props.href as string);
        }
      }}
    />
  );
}
