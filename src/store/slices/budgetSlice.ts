import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BudgetState {
  totalBudget: number;
  spent: number;
}

const initialState: BudgetState = {
  totalBudget: 0,
  spent: 0,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudget: (state, action: PayloadAction<number>) => {
      state.totalBudget = action.payload;
    },
    addExpense: (state, action: PayloadAction<number>) => {
      state.spent += action.payload;
    },
    resetBudget: (state) => {
      state.totalBudget = 0;
      state.spent = 0;
    },
  },
});

export const { setBudget, addExpense, resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
