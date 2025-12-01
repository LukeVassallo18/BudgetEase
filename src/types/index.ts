export type freqeuency = 'monthly' | 'weekly' | 'annualy';

export interface IncomeSource{
    id:string;
    name:string;
    amount:number;
    freqeuency: freqeuency;

}

export type ExpenseCategory = 'food' | 'transportation' | 'utilities' | 'entertainment' | 'healthcare' | 'other';
export interface Expense{
    id:string;
    description:string;
    amount:number;
    frequency: freqeuency;
    expense: ExpenseCategory;
    date: string;
}

export interface SavingsGoal{
    id:string;
    name:string;
    targetAmount:number;
    currentAmount:number;
    targetDate:string;
    description?:string;
}

export interface RootState{
    income:{
        source: IncomeSource[];
    };
    expenses:{
        items: Expense[];
    };
    savings:{
        goals: SavingsGoal[];
    }
}