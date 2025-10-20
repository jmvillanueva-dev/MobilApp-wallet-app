import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Debt } from "../types/types";

interface DebtCardProps {
  debt: Debt;
  onSettle: () => void;
}

const getInitial = (name: string) => name.substring(0, 1).toUpperCase();

export const DebtCard: React.FC<DebtCardProps> = ({ debt, onSettle }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{getInitial(debt.from)}</Text>
        </View>
        <View>
          <Text style={styles.debtorName}>{debt.from}</Text>
          <Text style={styles.debtDescription}>debe a {debt.to}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amountText}>${debt.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={onSettle}>
          <Text style={styles.settleButtonText}>Marcar pagado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6", // light gray for separator
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  initialsCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#FEE2E2", // bg-red-100
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  initialsText: {
    color: "#DC2626", // text-red-600
    fontWeight: "bold",
    fontSize: 16,
  },
  debtorName: {
    color: "#1F2937", // text-gray-800
    fontWeight: "600",
    fontSize: 16,
  },
  debtDescription: {
    fontSize: 14,
    color: "#6B7281", // text-gray-500
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC2626", // text-red-600
  },
  settleButtonText: {
    fontSize: 14,
    color: "#4F46E5", // text-indigo-600
    fontWeight: "600",
    marginTop: 4,
  },
});
