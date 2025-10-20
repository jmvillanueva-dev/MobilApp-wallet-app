import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image, // 1. IMPORTA el componente Image
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useExpenses } from "../../context/ExpenseContext";
import { Expense } from "../../types/types";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
    .replace(".", "");
};

// 2. MODIFICA ReceiptCard para que muestre la imagen real
const ReceiptCard: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <View style={styles.receiptCard}>
      {/* Usa el componente Image con la URI del recibo */}
      <Image source={{ uri: expense.receiptUri }} style={styles.receiptImage} />

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

        <View style={styles.gridContainer}>
          {expenses.map((expense) => (
            <ReceiptCard key={expense.id} expense={expense} />
          ))}
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
  // ... (otros estilos se mantienen igual)
  safeArea: {
    flex: 1,
    backgroundColor: "#F97316",
  },
  header: {
    backgroundColor: "#F97316",
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
    color: "#FFEDD5",
    marginTop: 4,
  },
  scrollViewContent: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
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
    color: "#1E3A8A",
    fontSize: 16,
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#1D4ED8",
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  receiptCard: {
    width: "48%",
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
  // 3. CAMBIA EL ESTILO para la imagen
  receiptImage: {
    backgroundColor: "#F3F4F6", // Color de fondo mientras carga la imagen
    height: 96,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%", // Asegura que la imagen ocupe todo el ancho de la tarjeta
  },
  receiptDescription: {
    fontWeight: "bold",
    color: "#1F2937",
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
    color: "#9CA3AF",
  },
  receiptAmount: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  totalCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    height: 165,
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
