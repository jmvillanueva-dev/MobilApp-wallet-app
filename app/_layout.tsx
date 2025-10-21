// app/_layout.tsx
import { ExpenseProvider } from "../context/ExpenseContext";
import { Stack } from "expo-router";
// import "./global.css";

export default function RootLayout() {
  return (
    // El proveedor debe envolver todo
    <ExpenseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ExpenseProvider>
  );
}
