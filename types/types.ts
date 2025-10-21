// types.ts

// Lista de usuarios fija según los requerimientos
export const USERS = ["Juan", "María", "Pedro"] as const;
export type User = (typeof USERS)[number];

// ----------------------------------------------------------------------
// Gasto (Expense)
// ----------------------------------------------------------------------

// Interface para el objeto Gasto
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: User;
  participants: User[];
  date: string;
  receiptUri: string;
}

// ----------------------------------------------------------------------
// Balance
// ----------------------------------------------------------------------

// Interface para un objeto de deuda simple (ej: María debe a Juan)
export interface Debt {
  from: User;
  to: User;
  amount: number;
  isSettled: boolean;
}

// Interface para el estado del balance general de la app
export interface BalanceState {
  totalSpent: number;
  debts: Debt[];
}

// ----------------------------------------------------------------------
// Contexto de la Aplicación
// ----------------------------------------------------------------------

// Interface para la función de agregar un nuevo gasto
export type AddExpenseFunction = (
  description: string,
  amount: number,
  paidBy: User,
  participants: User[],
  receiptUri: string
) => void;

export type SetSettledFunction = (debtToSettle: Debt) => void;

// Interface para el estado y las funciones del Contexto
export interface ExpenseContextType {
  expenses: Expense[];
  balance: BalanceState;
  addExpense: AddExpenseFunction;
  calculateBalance: (expenses: Expense[]) => BalanceState;
  // Agregaremos más funciones (e.g., setSettled, loadData, generateReport) después
}

// Datos iniciales de ejemplo
export const INITIAL_EXPENSES: Expense[] = [
  // {
  //   id: "e1",
  //   description: "Cena Restaurante",
  //   amount: 150.0,
  //   paidBy: "Juan",
  //   participants: ["Juan", "María", "Pedro"],
  //   date: "2025-10-15",
  //   receiptUri: "uri_restaurante.png", // Placeholder
  // },
  // {
  //   id: "e2",
  //   description: "Supermercado",
  //   amount: 280.0,
  //   paidBy: "María",
  //   participants: ["Juan", "María"],
  //   date: "2025-10-14",
  //   receiptUri: "uri_supermercado.png", // Placeholder
  // },
  // {
  //   id: "e3",
  //   description: "Uber",
  //   amount: 45.0,
  //   paidBy: "Pedro",
  //   participants: ["Juan", "María", "Pedro"],
  //   date: "2025-10-13",
  //   receiptUri: "uri_uber.png", // Placeholder
  // },
  // {
  //   id: "e4",
  //   description: "Café",
  //   amount: 25.0,
  //   paidBy: "Juan",
  //   participants: ["Juan", "María"],
  //   date: "2025-10-12",
  //   receiptUri: "uri_cafe.png", // Placeholder
  // },
];
