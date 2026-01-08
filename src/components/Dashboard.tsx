import { useAppSelector } from "../store/hooks";
import { EXPENSE_CATEGORIES } from "../store/slices/expenseSlice";

export default function Dashboard() {
  const incomes = useAppSelector((state) => state.income.incomes);
  const expenses = useAppSelector((state) => state.expense.expenses);
  const goals = useAppSelector((state) => state.savings.goals);

  // Calculate totals
  const totalMonthlyIncome = incomes.reduce((total, income) => {
    switch (income.frequency) {
      case "weekly":
        return total + income.amount * 4;
      case "bi-weekly":
        return total + income.amount * 2;
      case "monthly":
        return total + income.amount;
      case "one-time":
        return total;
      default:
        return total;
    }
  }, 0);

  const thisMonthExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const remainingBudget = totalMonthlyIncome - thisMonthExpenses;
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  // Get top spending categories
  const categorySpending = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        const now = new Date();
        return (
          e.category === cat.value &&
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0),
  }))
    .filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Recent transactions
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const budgetUsagePercent = totalMonthlyIncome > 0 
    ? (thisMonthExpenses / totalMonthlyIncome) * 100 
    : 0;

  return (
    <div className="p-4 pb-24 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl rotate-12 opacity-10"></div>
        <p className="text-gray-500 text-sm md:text-base relative flex items-center gap-2">
          Welcome back to BudgetEase 👋
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 relative">
          Your Dashboard
          <span className="ml-3 text-4xl">📊</span>
        </h1>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Budget Overview - Large Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full"></div>
          <div className="relative">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
              Remaining Budget
            </p>
            <p
              className={`text-5xl md:text-6xl font-bold mt-2 mb-4 ${
                remainingBudget < 0 ? "text-red-300" : ""
              }`}
            >
              €{remainingBudget.toFixed(2)}
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-100">Budget Used</span>
                <span className="font-bold">
                  {budgetUsagePercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetUsagePercent > 100
                      ? "bg-red-400"
                      : budgetUsagePercent > 80
                      ? "bg-yellow-400"
                      : "bg-white"
                  }`}
                  style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <p className="text-xs text-blue-100">Income</p>
                <p className="font-bold">€{totalMonthlyIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <p className="text-xs text-blue-100">Spent</p>
                <p className="font-bold">€{thisMonthExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-100 relative overflow-hidden group hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl mb-4 transform -rotate-6 group-hover:rotate-0 transition-transform">
              💰
            </div>
            <p className="text-gray-500 text-sm font-medium">Monthly Income</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              €{totalMonthlyIncome.toFixed(2)}
            </p>
            <p className="text-emerald-600 text-xs mt-2 font-medium">
              {incomes.length} source{incomes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center text-3xl mb-4 transform -rotate-6 group-hover:rotate-0 transition-transform">
              🎯
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Saved</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
              €{totalSaved.toFixed(2)}
            </p>
            <p className="text-purple-600 text-xs mt-2 font-medium">
              {goals.length} goal{goals.length !== 1 ? "s" : ""} •{" "}
              {totalGoalTarget > 0
                ? ((totalSaved / totalGoalTarget) * 100).toFixed(0)
                : 0}
              % complete
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending by Category */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-rose-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center text-2xl transform -rotate-6">
                📈
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Spending by Category
                </h2>
                <p className="text-gray-500 text-sm">This month's breakdown</p>
              </div>
            </div>

            {categorySpending.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📊</p>
                <p>No spending data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categorySpending.map((cat, index) => {
                  const percentage =
                    thisMonthExpenses > 0
                      ? (cat.total / thisMonthExpenses) * 100
                      : 0;
                  return (
                    <div key={cat.value} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transform group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: cat.color + "20" }}
                          >
                            {cat.icon}
                          </div>
                          <span className="font-semibold text-gray-700">
                            {cat.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            €{cat.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          {recentExpenses.length === 0 ? (
            <p className="text-center text-gray-400 py-6">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => {
                const category = EXPENSE_CATEGORIES.find(
                  (c) => c.value === expense.category
                )!;
                return (
                  <div key={expense.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {expense.description || category.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-red-500">
                      -€{expense.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
