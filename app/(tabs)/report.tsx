import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useExpenses } from "../../context/ExpenseContext";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generatePdfHtml } from "../../utils/pdfGenerator";

// Función para categorizar gastos (sin cambios)
const getCategory = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes("cena") || desc.includes("restaurante")) return "Restaurantes";
  if (desc.includes("supermercado")) return "Comida";
  if (desc.includes("uber") || desc.includes("transporte")) return "Transporte";
  if (desc.includes("café")) return "Café";
  return "Otros";
};

// NUEVO: Función para asignar un color a cada categoría
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Comida":
      return "#3B82F6"; // Azul
    case "Restaurantes":
      return "#8B5CF6"; // Morado
    case "Transporte":
      return "#F97316"; // Naranja
    case "Café":
      return "#A855F7"; // Púrpura
    default:
      return "#6B7281"; // Gris
  }
};

export default function ReportScreen() {
  const { expenses } = useExpenses();

  const totalGastos = expenses.reduce((sum, e) => sum + e.amount, 0);
  const promedioDia = expenses.length > 0 ? totalGastos / 15 : 0; // Asumiendo periodo de 15 días

  const gastosPorCategoria = expenses.reduce((acc, expense) => {
    const category = getCategory(expense.description);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Función para generar y compartir el PDF
  const handleShareReport = async () => {
    if (expenses.length === 0) {
      Alert.alert("Sin datos", "No hay gastos para generar un reporte.");
      return;
    }

    try {
      const html = generatePdfHtml({
        totalGastos,
        promedioDia,
        gastosPorCategoria,
        expenses,
      });

      const { uri } = await Print.printToFileAsync({ html });
      console.log("File has been saved to:", uri);

      if (!(await Sharing.isAvailableAsync())) {
        alert(`Compartir no está disponible en esta plataforma`);
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir reporte de gastos",
      });
    } catch (error) {
      console.error("Error al generar o compartir PDF:", error);
      Alert.alert("Error", "No se pudo generar o compartir el reporte.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reporte Mensual</Text>
          <Text style={styles.headerSubtitle}>Octubre 2025</Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={[styles.card, styles.totalCard]}>
            <Text style={styles.cardLabel}>Total Gastos</Text>
            <Text style={styles.totalAmount}>${totalGastos.toFixed(2)}</Text>
          </View>
          <View style={[styles.card, styles.totalCard, { marginLeft: 16 }]}>
            <Text style={styles.cardLabel}>Promedio/día</Text>
            <Text style={styles.totalAmount}>${promedioDia.toFixed(2)}</Text>
          </View>
        </View>

        {/* Expenses by Category */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gastos por Categoría</Text>
          {Object.entries(gastosPorCategoria).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${(amount / totalGastos) * 100}%`,
                      backgroundColor: getCategoryColor(category), // Color dinámico
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Report Period */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="calendar" size={18} /> Período del Reporte
          </Text>
          <View style={styles.dateInputsContainer}>
            <TouchableOpacity style={styles.dateInput}>
              <Text>01/10/2025</Text>
              <Feather name="calendar" size={16} color="#6B7281" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateInput}>
              <Text>17/10/2025</Text>
              <Feather name="calendar" size={16} color="#6B7281" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleShareReport}
        >
          <Feather name="download" size={20} color="white" />
          <Text style={styles.buttonPrimaryText}>Generar y Guardar PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={handleShareReport}
        >
          <Feather name="share-2" size={20} color="#4F46E5" />
          <Text style={styles.buttonSecondaryText}>Compartir Reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollView: { padding: 16 },
  header: {
    backgroundColor: "#4F46E5",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  headerTitle: { color: "white", fontSize: 28, fontWeight: "bold" },
  headerSubtitle: { color: "#C7D2FE", fontSize: 16, marginTop: 4 },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  totalsContainer: { flexDirection: "row", justifyContent: "space-between" },
  totalCard: { flex: 1, marginBottom: 0 },
  cardLabel: { fontSize: 14, color: "#6B7281" },
  totalAmount: { fontSize: 24, fontWeight: "bold", color: "#1F2937", marginTop: 4 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  categoryItem: { marginBottom: 16 },
  categoryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  categoryName: { color: "#374151", fontSize: 16 },
  categoryAmount: { fontWeight: "600", color: "#1F2937", fontSize: 16 },
  progressBarBackground: { backgroundColor: "#E5E7EB", borderRadius: 8, height: 8 },
  progressBar: { height: 8, borderRadius: 8 },
  dateInputsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      width: '48%',
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPrimaryText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  buttonSecondary: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondaryText: { color: "#4F46E5", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});