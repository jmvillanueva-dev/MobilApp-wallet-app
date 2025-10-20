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
import { DebtCard } from "../../components/DebtCard";
import { USERS } from "../../types/types";

export default function BalanceScreen() {
  const { balance, expenses, setDebtSettled } = useExpenses();

  const unsettledDebts = balance.debts.filter((debt) => !debt.isSettled);

  const spendingByUser = USERS.reduce((acc, user) => {
    acc[user] = expenses
      .filter((e) => e.paidBy === user)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const averagePerPerson =
    USERS.length > 0 ? balance.totalSpent / USERS.length : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Balance de Cuentas</Text>
        <Text style={styles.headerSubtitle}>¿Quién debe a quién?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Debts Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="dollar-sign" size={18} color="#374151" /> Resumen de
            Deudas
          </Text>
          {unsettledDebts.length > 0 ? (
            unsettledDebts.map((debt, index) => (
              <DebtCard
                key={`${debt.from}-${debt.to}-${index}`}
                debt={debt}
                onSettle={() => setDebtSettled(debt)}
              />
            ))
          ) : (
            <Text style={styles.noDebtsText}>
              ¡Todas las cuentas están saldadas! 🎉
            </Text>
          )}
        </View>

        {/* Algorithm Breakdown Card */}
        <View style={[styles.card, styles.breakdownCard]}>
          <Text style={styles.breakdownCardTitle}>Algoritmo de División</Text>
          <Text style={styles.breakdownSubtitle}>
            Método: Simplificación de deudas
          </Text>
          {Object.entries(spendingByUser).map(([user, amount]) => (
            <View key={user} style={styles.spendingRow}>
              <Text style={styles.spendingUser}>{user} gastó:</Text>
              <Text style={styles.spendingAmount}>${amount.toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.spendingRow}>
            <Text style={styles.averageText}>Promedio por persona:</Text>
            <Text style={styles.averageAmount}>
              ${averagePerPerson.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4F46E5", // purple header background
  },
  header: {
    backgroundColor: "#4F46E5", // indigo-600
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#C7D2FE", // indigo-200
    marginTop: 4,
  },
  scrollView: {
    backgroundColor: "#F3F4F6", // bg-gray-100
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151", // text-gray-700
    marginBottom: 8,
  },
  noDebtsText: {
    color: "#6B7281",
    textAlign: "center",
    paddingVertical: 16,
    fontSize: 16,
  },
  breakdownCard: {
    backgroundColor: "#F0FDF4", // bg-green-50
    borderColor: "#A7F3D0", // border-green-200
    borderWidth: 1,
  },
  breakdownCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065F46", // text-green-800
    marginBottom: 4,
  },
  breakdownSubtitle: {
    fontSize: 14,
    color: "#047857", // text-green-700
    marginBottom: 16,
  },
  spendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  spendingUser: {
    color: "#065F46",
    fontSize: 16,
  },
  spendingAmount: {
    color: "#065F46",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#A7F3D0",
    marginVertical: 8,
  },
  averageText: {
    color: "#065F46",
    fontWeight: "bold",
    fontSize: 16,
  },
  averageAmount: {
    color: "#065F46",
    fontWeight: "bold",
    fontSize: 16,
  },
});
