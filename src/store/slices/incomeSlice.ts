import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IncomeSource } from "../../types";


interface IncomeState{
    sources: IncomeSource[];
}

const initialState: IncomeState = {
    sources: [],
};

const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers:{
        // CRUD
        addIncome:(state, action: PayloadAction<IncomeSource>)=>{
            state.sources.push(action.payload);
        },
        loadIncome: (state, action: PayloadAction<IncomeSource[]>)=>{
            state.sources = action.payload;
        },
        updateIncome:(state, action: PayloadAction<IncomeSource>)=>{
            const index = state.sources.findIndex(source => source.id === action.payload.id);
            // if the item was not found, return -1
            // hence when the index is not -1, we can update the item
            if(index !== -1){
                state.sources[index] = action.payload;
            }
        },
        deleteIncome:(state, action: PayloadAction<string>)=>{
            state.sources = state.sources.filter(source => source.id !== action.payload);
        }

    }
});

export const { addIncome, loadIncome, updateIncome, deleteIncome } = incomeSlice.actions;

export default incomeSlice.reducer;