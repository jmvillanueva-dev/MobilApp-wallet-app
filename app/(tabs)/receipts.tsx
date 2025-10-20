import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useExpenses } from "../../context/ExpenseContext";
import { Expense } from "../../types/types";

// Helper to format date as "15 Oct"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
    .replace(".", ""); // Remove period after month abbreviation if present
};

// You can keep this as a separate component or in the same file
const ReceiptCard: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <View style={styles.receiptCard}>
      <View style={styles.receiptImagePlaceholder}>
        <Feather name="file-text" size={32} color="#9CA3AF" />
      </View>
      <Text style={styles.receiptDescription} numberOfLines={1}>
        {expense.description}
      </Text>
      <View style={styles.receiptFooter}>
        <Text style={styles.receiptDate}>{formatDate(expense.date)}</Text>
        <Text style={styles.receiptAmount}>${expense.amount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default function ReceiptsScreen() {
  const { expenses } = useExpenses();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galería de Recibos</Text>
        <Text style={styles.headerSubtitle}>
          {expenses.length} recibos registrados
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.infoBox}>
          <Feather name="camera" size={24} color="#2563EB" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Recibos Verificados</Text>
            <Text style={styles.infoSubtitle}>
              Todos los gastos incluyen foto del recibo para mayor control.
            </Text>
          </View>
        </View>

        {/* Receipts Grid */}
        <View style={styles.gridContainer}>
          {expenses.map((expense) => (
            <ReceiptCard key={expense.id} expense={expense} />
          ))}
          {/* Total card from the screenshot */}
          <View style={[styles.receiptCard, styles.totalCard]}>
            <Text style={styles.totalNumber}>{expenses.length}</Text>
            <Text style={styles.totalText}>Total Recibos</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F97316", // Orange header background
  },
  header: {
    backgroundColor: "#F97316", // bg-orange-500
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFEDD5", // text-orange-100
    marginTop: 4,
  },
  scrollViewContent: {
    padding: 16,
    backgroundColor: "#F9FAFB", // bg-gray-50
  },
  infoBox: {
    backgroundColor: "#EFF6FF", // bg-blue-50
    borderColor: "#BFDBFE", // border-blue-200
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontWeight: "bold",
    color: "#1E3A8A", // text-blue-800
    fontSize: 16,
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#1D4ED8", // text-blue-700
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // Receipt Card Styles
  receiptCard: {
    width: "48%", // Creates two columns with a small gap
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 16,
    padding: 12,
  },
  receiptImagePlaceholder: {
    backgroundColor: "#F3F4F6", // bg-gray-100
    height: 96,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  receiptDescription: {
    fontWeight: "bold",
    color: "#1F2937", // text-gray-800
    fontSize: 16,
  },
  receiptFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  receiptDate: {
    fontSize: 12,
    color: "#9CA3AF", // text-gray-400
  },
  receiptAmount: {
    fontWeight: "bold",
    color: "#4B5563", // text-gray-600
  },
  // Total Card Specific Styles
  totalCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    height: 165, // Match height of other cards for alignment
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalText: {
    fontSize: 14,
    color: "#6B7281",
    marginTop: 4,
  },
});
