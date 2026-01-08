import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: "weekly" | "bi-weekly" | "monthly" | "one-time";
  date: string;
  description?: string;
}

interface IncomeState {
  incomes: Income[];
}

const loadFromLocalStorage = (): Income[] => {
  try {
    const data = localStorage.getItem("budgetease-incomes");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (incomes: Income[]) => {
  localStorage.setItem("budgetease-incomes", JSON.stringify(incomes));
};

const initialState: IncomeState = {
  incomes: loadFromLocalStorage(),
};

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    addIncome: (state, action: PayloadAction<Omit<Income, "id">>) => {
      const newIncome: Income = {
        id: nanoid(),
        ...action.payload,
      };
      state.incomes.push(newIncome);
    },
    updateIncome: (state, action: PayloadAction<Income>) => {
      const index = state.incomes.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.incomes[index] = action.payload;
        saveToLocalStorage(state.incomes);
      }
    },
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.incomes = state.incomes.filter((i) => i.id !== action.payload);
      saveToLocalStorage(state.incomes);
    },
  },
});

export const { addIncome, updateIncome, deleteIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
