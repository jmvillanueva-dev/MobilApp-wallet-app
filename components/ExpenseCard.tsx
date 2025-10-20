import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Expense, User } from "../types/types";

interface ExpenseCardProps {
  expense: Expense;
}

// Función para obtener las iniciales de un nombre
const getInitials = (name: string) => name.substring(0, 1).toUpperCase();

// Paleta de colores para los avatares de los participantes
const avatarColors: Record<User, { background: string; text: string }> = {
  Juan: { background: "#DBEAFE", text: "#1E40AF" },
  María: { background: "#FCE7F3", text: "#9D174D" },
  Pedro: { background: "#D1FAE5", text: "#065F46" },
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  // Formatea la fecha a un formato más legible
  const formattedDate = new Date(expense.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  return (
    <View style={styles.card}>
      {/* Sección Superior: Descripción y Monto */}
      <View style={styles.topSection}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{expense.description}</Text>
          <Text style={styles.paidByText}>Pagado por {expense.paidBy}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>${expense.amount.toFixed(2)}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      {/* Sección Inferior: Participantes y Recibo */}
      <View style={styles.bottomSection}>
        <View style={styles.participantsContainer}>
          {expense.participants.map((p) => (
            <View
              key={p}
              style={[
                styles.avatar,
                { backgroundColor: avatarColors[p].background },
              ]}
            >
              <Text
                style={[styles.avatarText, { color: avatarColors[p].text }]}
              >
                {getInitials(p)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.receiptStatus}>
          <Feather name="check-circle" size={14} color="#10B981" />
          <Text style={styles.receiptText}>Recibo adjunto</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937", // text-gray-800
  },
  paidByText: {
    fontSize: 14,
    color: "#6B7281", // text-gray-500
    marginTop: 4,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF", // text-gray-400
    marginTop: 4,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6", // border-gray-100
  },
  participantsContainer: {
    flexDirection: "row",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8, // solapamiento
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  receiptStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptText: {
    fontSize: 12,
    color: "#059669", // text-green-600
    marginLeft: 4,
  },
});
