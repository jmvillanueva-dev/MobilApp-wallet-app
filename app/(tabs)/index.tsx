import React, { useState } from "react"; // Importa useState
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
import { ExpenseCard } from "../../components/ExpenseCard";
import { AddExpenseModal } from "../../components/AddExpenseModal"; // Importa el nuevo componente

export default function HomeScreen() {
  const { expenses, balance, addExpense } = useExpenses(); // Obtén addExpense del contexto
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

  const getCurrentMonth = () => {
    return new Date().toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Total gastado</Text>
            <Feather name="users" size={24} color="white" />
          </View>
          <Text style={styles.headerAmount}>
            ${balance.totalSpent.toFixed(2)}
          </Text>
          <Text style={styles.headerDate}>{getCurrentMonth()}</Text>
        </View>

        {/* Expenses List */}
        <Text style={styles.listTitle}>Gastos Recientes</Text>
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))
        ) : (
          <Text style={styles.noExpensesText}>No hay gastos registrados.</Text>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {/* Actualiza el onPress para abrir el modal */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Renderiza el componente Modal */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddExpense={addExpense}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    padding: 16,
    paddingBottom: 80, // Agrega espacio para que el FAB no tape el último elemento
  },
  headerCard: {
    backgroundColor: "#4F46E5",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  headerAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 8,
  },
  headerDate: {
    color: "#C7D2FE",
    fontSize: 14,
    marginTop: 4,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  noExpensesText: {
    textAlign: "center",
    color: "#6B7281",
    marginTop: 20,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
