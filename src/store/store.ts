import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";
import incomeReducer from "./slices/incomeSlice";
import savingsReducer from "./slices/savingsSlice";

export const store = configureStore({
  reducer: {
    income: incomeReducer,
    expense: expenseReducer,
    savings: savingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
