// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Asegúrate de tener instalado @expo/vector-icons

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4F46E5", // Un color índigo para el ícono activo
        tabBarInactiveTintColor: "#6B7280", // Un color gris para los inactivos
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: "Balance",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: "Recibos",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="image" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Reporte",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
