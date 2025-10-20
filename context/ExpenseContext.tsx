import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// Para el entorno de compilación, usamos un alias para simular la importación de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USERS,
  Expense,
  ExpenseContextType,
  BalanceState,
  Debt,
  INITIAL_EXPENSES,
  User,
  SetSettledFunction,
} from "../types/types";
import { View, Text } from "react-native"; // Importación necesaria para evitar errores de compilación de RN

// Clave para AsyncStorage
const STORAGE_KEY = "@SharedExpensesApp:expenses";

// Definición del Contexto con valores por defecto que coinciden con la interfaz
export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  balance: { totalSpent: 0, debts: [] },
  addExpense: () => {},
  calculateBalance: () => ({ totalSpent: 0, debts: [] }),
  setDebtSettled: () => {}, // Inicialización de la nueva función
});

// Componente Proveedor del Contexto
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Nota: El estado de 'expenses' y la lógica de persistencia no se modifican
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // El estado de las deudas resueltas debe ser persistente
  const [settledDebts, setSettledDebts] = useState<Debt[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ----------------------------------------------------------------------
  // 1. Lógica de Persistencia (AsyncStorage - Requerimiento 2)
  // Se extiende para manejar las deudas resueltas
  // ----------------------------------------------------------------------

  // Carga inicial de datos desde AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonExpenses = await AsyncStorage.getItem(
          STORAGE_KEY + "_expenses"
        );
        const jsonSettled = await AsyncStorage.getItem(
          STORAGE_KEY + "_settled"
        );

        if (jsonExpenses != null) {
          setExpenses(JSON.parse(jsonExpenses) as Expense[]);
        } else {
          setExpenses(INITIAL_EXPENSES);
        }

        if (jsonSettled != null) {
          setSettledDebts(JSON.parse(jsonSettled) as Debt[]);
        }
      } catch (e) {
        console.error("Error al cargar datos:", e);
        setExpenses(INITIAL_EXPENSES);
        setSettledDebts([]);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // Guarda los datos en AsyncStorage cada vez que 'expenses' o 'settledDebts' cambian
  useEffect(() => {
    if (isDataLoaded) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(
            STORAGE_KEY + "_expenses",
            JSON.stringify(expenses)
          );
          await AsyncStorage.setItem(
            STORAGE_KEY + "_settled",
            JSON.stringify(settledDebts)
          );
        } catch (e) {
          console.error("Error al guardar datos:", e);
        }
      };
      saveData();
    }
  }, [expenses, settledDebts, isDataLoaded]);

  // ----------------------------------------------------------------------
  // 2. Cálculo de Balance (Requerimiento 3)
  // La lógica principal de calculateBalance no se modifica.
  // ----------------------------------------------------------------------

  const calculateBalance = useCallback(
    (currentExpenses: Expense[]): BalanceState => {
      // 1. Calcular el total gastado por cada persona y la contribución neta
      const netContributions = new Map<User, number>();
      let totalSpent = 0;

      USERS.forEach((user) => netContributions.set(user, 0));

      currentExpenses.forEach((expense) => {
        totalSpent += expense.amount;
        const paidBy = expense.paidBy;
        netContributions.set(
          paidBy,
          netContributions.get(paidBy)! + expense.amount
        );
        const participantCount = expense.participants.length;
        const amountPerPerson = expense.amount / participantCount;

        expense.participants.forEach((participant) => {
          netContributions.set(
            participant,
            netContributions.get(participant)! - amountPerPerson
          );
        });
      });

      // 2. Simplificación de Deudas
      const creditors: { user: User; amount: number }[] = [];
      const debtors: { user: User; amount: number }[] = [];

      netContributions.forEach((netAmount, user) => {
        const roundedAmount = parseFloat(netAmount.toFixed(2));
        if (roundedAmount > 0) {
          creditors.push({ user, amount: roundedAmount });
        } else if (roundedAmount < 0) {
          debtors.push({ user, amount: Math.abs(roundedAmount) });
        }
      });

      // 3. Generar las deudas simplificadas (sin considerar las resueltas aún)
      const simplifiedDebts: Debt[] = [];
      let i = 0;
      let j = 0;

      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const transferAmount = Math.min(debtor.amount, creditor.amount);

        if (transferAmount > 0.01) {
          simplifiedDebts.push({
            from: debtor.user,
            to: creditor.user,
            amount: parseFloat(transferAmount.toFixed(2)),
            isSettled: false,
          });

          // Ajustar balances
          debtor.amount -= transferAmount;
          creditor.amount -= transferAmount;
        }

        if (debtor.amount < 0.01) {
          i++;
        }
        if (creditor.amount < 0.01) {
          j++;
        }
      }

      // 4. Integrar las deudas resueltas
      const combinedDebts: Debt[] = [
        ...simplifiedDebts,
        ...settledDebts.map((debt) => ({ ...debt, isSettled: true })),
      ];

      return { totalSpent, debts: combinedDebts };
    },
    [settledDebts]
  ); // Depende de settledDebts

  // Calcular el balance cada vez que los gastos o deudas resueltas cambian
  const balance = useMemo(
    () => calculateBalance(expenses),
    [expenses, calculateBalance]
  );

  // ----------------------------------------------------------------------
  // 3. Función para Agregar Gasto (Requerimiento 1)
  // ----------------------------------------------------------------------

  const addExpense: ExpenseContextType["addExpense"] = useCallback(
    (description, amount, paidBy, participants, receiptUri) => {
      if (
        !description ||
        amount <= 0 ||
        !paidBy ||
        participants.length === 0 ||
        !receiptUri
      ) {
        console.error(
          "Validación fallida: Faltan campos obligatorios para el gasto."
        );
        return;
      }

      const newExpense: Expense = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount.toFixed(2)),
        paidBy,
        participants,
        date: new Date().toISOString().split("T")[0],
        receiptUri,
      };

      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    },
    []
  );

  // ----------------------------------------------------------------------
  // 4. Función para Marcar Deuda como Pagada (Requerimiento 3 - Adición)
  // ----------------------------------------------------------------------

  const setDebtSettled: SetSettledFunction = useCallback((debtToMark) => {
    // Para simplificar, movemos la deuda marcada a la lista de deudas resueltas
    // En una aplicación real, se debería registrar una transacción de pago
    setSettledDebts((prevSettled) => {
      // Evitar duplicados si ya fue marcada
      const isDuplicate = prevSettled.some(
        (d) =>
          d.from === debtToMark.from &&
          d.to === debtToMark.to &&
          d.amount === debtToMark.amount
      );

      if (!isDuplicate) {
        return [...prevSettled, { ...debtToMark, isSettled: true }];
      }
      return prevSettled;
    });

    // Opcional: Si se marca una deuda, se puede querer "limpiar" los gastos.
    // Por ahora solo la marcamos como resuelta.
  }, []);

  const contextValue: ExpenseContextType = useMemo(
    () => ({
      expenses,
      balance,
      addExpense,
      calculateBalance,
      setDebtSettled,
    }),
    [expenses, balance, addExpense, calculateBalance, setDebtSettled]
  );

  return (
    <ExpenseContext.Provider value={contextValue}>
      {/* Solo renderizar el contenido de la app una vez que los datos han sido cargados */}
      {isDataLoaded ? children : null}
    </ExpenseContext.Provider>
  );
};

// Hook personalizado para un uso más fácil del contexto
export const useExpenses = () => {
  const context = React.useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses debe usarse dentro de un ExpenseProvider");
  }
  return context;
};
