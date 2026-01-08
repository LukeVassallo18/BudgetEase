import { useAppDispatch, useAppSelector } from './store/hooks'
import { addExpense, resetBudget, setBudget } from "./store/slices/budgetSlice";

function App() {
  const dispatch = useAppDispatch()
  const { totalBudget, spent } = useAppSelector((state) => state.budget)
  const remaining = totalBudget - spent

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          BudgetEase
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Budget Overview</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-blue-600">${totalBudget}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Spent</p>
              <p className="text-2xl font-bold text-red-600">${spent}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-green-600">${remaining}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => dispatch(setBudget(1000))}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Set Budget to $1000
            </button>
            
            <button
              onClick={() => dispatch(addExpense(50))}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Add $50 Expense
            </button>
            
            <button
              onClick={() => dispatch(resetBudget())}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Reset Budget
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>✅ React + TypeScript</li>
            <li>✅ Redux Toolkit for state management</li>
            <li>✅ Tailwind CSS for styling</li>
            <li>✅ Vite for fast development</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
