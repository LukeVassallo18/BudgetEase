import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
}

interface SavingsState {
  goals: SavingsGoal[];
}

const loadFromLocalStorage = (): SavingsGoal[] => {
  try {
    const data = localStorage.getItem("budgetease-savings");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (goals: SavingsGoal[]) => {
  localStorage.setItem("budgetease-savings", JSON.stringify(goals));
};

const initialState: SavingsState = {
  goals: loadFromLocalStorage(),
};

const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<SavingsGoal, "id">>) => {
      const newGoal = { ...action.payload, id: uuidv4() };
      state.goals.push(newGoal);
      saveToLocalStorage(state.goals);
    },
    updateGoal: (state, action: PayloadAction<SavingsGoal>) => {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
        saveToLocalStorage(state.goals);
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
      saveToLocalStorage(state.goals);
    },
    addToGoal: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount = Math.min(
          goal.currentAmount + action.payload.amount,
          goal.targetAmount
        );
        saveToLocalStorage(state.goals);
      }
    },
    withdrawFromGoal: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.goals.find((g) => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount = Math.max(goal.currentAmount - action.payload.amount, 0);
        saveToLocalStorage(state.goals);
      }
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, addToGoal, withdrawFromGoal } =
  savingsSlice.actions;
export default savingsSlice.reducer;
