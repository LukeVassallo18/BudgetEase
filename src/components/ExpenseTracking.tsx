import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    addExpense,
    deleteExpense,
    EXPENSE_CATEGORIES,
    updateExpense,
    type Expense,
    type ExpenseCategory,
} from "../store/slices/expenseSlice";

export default function ExpenseTracking() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expense.expenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">("all");
  const [formData, setFormData] = useState({
    amount: "",
    category: "food" as ExpenseCategory,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "food",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingExpense(null);
  };

  const openModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: expense.date,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    if (editingExpense) {
      dispatch(updateExpense({ ...expenseData, id: editingExpense.id }));
    } else {
      dispatch(addExpense(expenseData));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id));
    }
  };

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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

  const getCategoryInfo = (category: ExpenseCategory) =>
    EXPENSE_CATEGORIES.find((c) => c.value === category)!;

  // Get spending by category for the chart
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((cat) => cat.total > 0);

  return (
    <div className="p-4 pb-24 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with creative layout */}
      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-3xl rotate-12 opacity-10"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 relative">
          Expense Tracker
          <span className="ml-3 text-4xl">💸</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 relative">
          Monitor your spending habits and stay on budget
        </p>
      </div>

      {/* Summary Cards with asymmetric design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Main expense card - larger */}
        <div className="md:col-span-2 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative">
            <p className="text-red-100 text-sm font-medium uppercase tracking-wide">
              This Month's Spending
            </p>
            <p className="text-5xl md:text-6xl font-bold mt-2 mb-4">
              €{thisMonthExpenses.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <span className="text-2xl">🧾</span>
              <span className="text-sm font-medium">
                {expenses.filter((e) => {
                  const expenseDate = new Date(e.date);
                  const now = new Date();
                  return (
                    expenseDate.getMonth() === now.getMonth() &&
                    expenseDate.getFullYear() === now.getFullYear()
                  );
                }).length} transactions
              </span>
            </div>
          </div>
        </div>

        {/* All time total card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-red-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200 to-rose-200 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center text-2xl transform -rotate-6">
                📊
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">All Time Total</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              €{totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Category breakdown mini card */}
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl transform rotate-6">
                📈
              </div>
            </div>
            <p className="text-orange-100 text-sm font-medium">Categories</p>
            <p className="text-3xl font-bold mt-1">
              {categoryTotals.length}
            </p>
            <p className="text-orange-100 text-xs mt-1">active this period</p>
          </div>
        </div>
      </div>

      {/* Add Button with creative style */}
      <button
        onClick={() => openModal()}
        className="w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-8 rounded-2xl mb-8 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
        <span className="relative">Add Expense</span>
      </button>

      {/* Category Filter - Enhanced */}
      <div className="mb-6">
        <p className="text-sm font-bold text-gray-700 mb-3">Filter by Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              filterCategory === "all"
                ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            All Expenses
          </button>
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                filterCategory === cat.value
                  ? "text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
              }`}
              style={
                filterCategory === cat.value
                  ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` }
                  : {}
              }
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List with creative layout */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[20rem] transform rotate-12">🧾</div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-rose-300 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
              🧾
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">No expenses recorded</p>
            <p className="text-gray-400">Add your first expense to start tracking</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...filteredExpenses]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense, index) => {
              const categoryInfo = getCategoryInfo(expense.category);
              const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
              const rotation = rotations[index % rotations.length];

              return (
                <div
                  key={expense.id}
                  className={`bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 relative overflow-hidden group transform hover:-translate-y-1 hover:${rotation}`}
                >
                  {/* Decorative corner element */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full group-hover:scale-150 transition-transform"
                    style={{ backgroundColor: categoryInfo.color }}
                  ></div>

                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 transform -rotate-6 group-hover:rotate-0 transition-transform"
                          style={{ backgroundColor: categoryInfo.color + "30" }}
                        >
                          {categoryInfo.icon}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {expense.description || categoryInfo.label}
                        </h3>
                        <p
                          className="font-black text-3xl"
                          style={{ color: categoryInfo.color }}
                        >
                          -€{expense.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openModal(expense)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className="text-xs text-white font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {categoryInfo.label}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-full">
                        📅 {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Modal - enhanced */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Decorative header background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-red-400 to-rose-500 opacity-10 rounded-t-3xl"></div>

            <div className="p-6 md:p-8 relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {editingExpense ? "Edit Expense" : "Add Expense"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Track your spending</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:rotate-90"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Amount (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-3xl font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, category: cat.value })
                        }
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                          formData.category === cat.value
                            ? "ring-4 ring-offset-2 scale-105 shadow-lg"
                            : "hover:bg-gray-50 border-2 border-gray-100"
                        }`}
                        style={{
                          backgroundColor: cat.color + "20",
                          ["--tw-ring-color" as string]:
                            formData.category === cat.value ? cat.color : undefined,
                        }}
                      >
                        <span className="text-3xl">{cat.icon}</span>
                        <span className="text-xs text-gray-600 font-semibold truncate w-full text-center">
                          {cat.label.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lunch at cafeteria"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-6"
                >
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
