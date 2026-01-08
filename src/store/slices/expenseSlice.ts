import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type ExpenseCategory =
  | "food"
  | "transport"
  | "entertainment"
  | "utilities"
  | "education"
  | "health"
  | "shopping"
  | "other";

export interface CategoryInfo {
  value: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { value: "food", label: "Food & Dining", icon: "🍔", color: "#FF6B6B" },
  { value: "transport", label: "Transport", icon: "🚌", color: "#4ECDC4" },
  { value: "entertainment", label: "Entertainment", icon: "🎬", color: "#45B7D1" },
  { value: "utilities", label: "Utilities", icon: "💡", color: "#96CEB4" },
  { value: "education", label: "Education", icon: "📚", color: "#FFEAA7" },
  { value: "health", label: "Health", icon: "💊", color: "#DDA0DD" },
  { value: "shopping", label: "Shopping", icon: "🛍️", color: "#FF8C00" },
  { value: "other", label: "Other", icon: "📦", color: "#778899" },
];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];
}

const loadFromLocalStorage = (): Expense[] => {
  try {
    const data = localStorage.getItem("budgetease-expenses");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (expenses: Expense[]) => {
  localStorage.setItem("budgetease-expenses", JSON.stringify(expenses));
};

const initialState: ExpenseState = {
  expenses: loadFromLocalStorage(),
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, "id">>) => {
      const newExpense = { ...action.payload, id: uuidv4() };
      state.expenses.push(newExpense);
      saveToLocalStorage(state.expenses);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
        saveToLocalStorage(state.expenses);
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      saveToLocalStorage(state.expenses);
    },
  },
});

export const { addExpense, updateExpense, deleteExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
