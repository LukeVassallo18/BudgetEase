import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    addIncome,
    deleteIncome,
    updateIncome,
    type Income,
} from "../store/slices/incomeSlice";

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "one-time", label: "One-time" },
] as const;

export default function IncomeManagement() {
  const dispatch = useAppDispatch();
  const incomes = useAppSelector((state) => state.income.incomes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    frequency: "monthly" as Income["frequency"],
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const resetForm = () => {
    setFormData({
      source: "",
      amount: "",
      frequency: "monthly",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setEditingIncome(null);
  };

  const openModal = (income?: Income) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        source: income.source,
        amount: income.amount.toString(),
        frequency: income.frequency,
        date: income.date,
        description: income.description || "",
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
    const incomeData = {
      source: formData.source,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      date: formData.date,
      description: formData.description,
    };

    if (editingIncome) {
      dispatch(updateIncome({ ...incomeData, id: editingIncome.id }));
    } else {
      dispatch(addIncome(incomeData));
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this income source?")) {
      dispatch(deleteIncome(id));
    }
  };

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

  return (
    <div className="p-4 pb-24 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with creative layout */}
      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl rotate-12 opacity-10"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 relative">
          Income Sources
          <span className="ml-3 text-4xl">💰</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 relative">
          Track your stipend and apprenticeship income
        </p>
      </div>

      {/* Summary Cards with asymmetric design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Main income card - larger */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative">
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
              Estimated Monthly Income
            </p>
            <p className="text-5xl md:text-6xl font-bold mt-2 mb-4">
              €{totalMonthlyIncome.toFixed(2)}
            </p>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">
                {incomes.length} source{incomes.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-2xl transform -rotate-6">
                💵
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Average Income</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              €{incomes.length > 0 ? (incomes.reduce((sum, i) => sum + i.amount, 0) / incomes.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Add Button with creative style */}
      <button
        onClick={() => openModal()}
        className="w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl mb-8 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
        <span className="relative">Add Income Source</span>
      </button>

      {/* Income List with masonry-style layout */}
      {incomes.length === 0 ? (
        <div className="text-center py-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[20rem] transform rotate-12">💰</div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
              💰
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">No income sources yet</p>
            <p className="text-gray-400">Add your first income to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {incomes.map((income, index) => {
            const colors = [
              { from: "from-emerald-400", to: "to-teal-500", accent: "bg-emerald-500" },
              { from: "from-teal-400", to: "to-cyan-500", accent: "bg-teal-500" },
              { from: "from-cyan-400", to: "to-blue-500", accent: "bg-cyan-500" },
              { from: "from-emerald-500", to: "to-green-600", accent: "bg-emerald-600" },
            ];
            const color = colors[index % colors.length];

            return (
              <div
                key={income.id}
                className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 relative overflow-hidden group transform hover:-translate-y-1"
              >
                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color.from} ${color.to} opacity-20 rounded-bl-full group-hover:scale-150 transition-transform`}></div>
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className={`w-14 h-14 ${color.accent} bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl mb-3 transform -rotate-6 group-hover:rotate-0 transition-transform`}>
                        💵
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{income.source}</h3>
                      <p className={`bg-gradient-to-r ${color.from} ${color.to} bg-clip-text text-transparent font-black text-3xl`}>
                        €{income.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(income)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs ${color.accent} bg-opacity-20 text-gray-700 font-semibold px-3 py-1.5 rounded-full`}>
                      {FREQUENCY_OPTIONS.find((f) => f.value === income.frequency)?.label}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-full">
                      📅 {new Date(income.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {income.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-100">
                      {income.description}
                    </p>
                  )}
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
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 rounded-t-3xl"></div>
            
            <div className="p-6 md:p-8 relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {editingIncome ? "Edit Income" : "Add Income"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Fill in the details below</p>
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
                    Income Source *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Stipend, Part-time job"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

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
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-2xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            frequency: option.value,
                          })
                        }
                        className={`p-4 rounded-2xl font-semibold transition-all ${
                          formData.frequency === option.value
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Optional notes..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-6"
                >
                  {editingIncome ? "Update Income" : "Add Income"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
