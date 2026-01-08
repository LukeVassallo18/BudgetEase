import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    addGoal,
    addToGoal,
    deleteGoal,
    updateGoal,
    type SavingsGoal,
} from "../store/slices/savingsSlice";

export default function SavingsGoals() {
  const dispatch = useAppDispatch();
  const goals = useAppSelector((state) => state.savings.goals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<SavingsGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    icon: "🎯",
  });

  const GOAL_ICONS = ["🎯", "🏠", "🚗", "✈️", "💻", "📱", "🎓", "💍", "🎮", "📷", "🎸", "⌚", "👟", "🎁", "💰"];

  const resetForm = () => {
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      icon: "🎯",
    });
    setEditingGoal(null);
  };

  const openModal = (goal?: SavingsGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline || "",
        icon: goal.icon || "🎯",
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

  const openContributeModal = (goal: SavingsGoal) => {
    setSelectedGoalForContribution(goal);
    setContributionAmount("");
    setIsContributeModalOpen(true);
  };

  const closeContributeModal = () => {
    setIsContributeModalOpen(false);
    setSelectedGoalForContribution(null);
    setContributionAmount("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline || undefined,
      icon: formData.icon,
      color: "",
    };

    if (editingGoal) {
      dispatch(updateGoal({
          ...goalData, id: editingGoal.id,
          color: ""
      }));
    } else {
      dispatch(addGoal(goalData));
    }
    closeModal();
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoalForContribution && contributionAmount) {
      dispatch(
        addToGoal({
          id: selectedGoalForContribution.id,
          amount: parseFloat(contributionAmount),
        })
      );
      closeContributeModal();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this savings goal?")) {
      dispatch(deleteGoal(id));
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  return (
    <div className="p-4 pb-24 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header with creative layout */}
      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-violet-500 rounded-3xl rotate-12 opacity-10"></div>
        <div className="absolute top-8 left-32 w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-2xl -rotate-12 opacity-10 hidden md:block"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 relative">
          Savings Goals
          <span className="ml-3 text-4xl">🎯</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 relative">
          Track your dreams and watch them come true
        </p>
      </div>

      {/* Summary Cards with asymmetric design */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        {/* Main savings card - larger and spans more columns */}
        <div className="md:col-span-7 bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div className="absolute top-1/2 right-20 w-24 h-24 bg-white/5 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute bottom-10 right-1/3 w-16 h-16 bg-white/5 rounded-2xl rotate-45"></div>
          <div className="relative">
            <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">
              Total Saved
            </p>
            <p className="text-5xl md:text-6xl font-bold mt-2 mb-4">
              €{totalSaved.toFixed(2)}
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-100">Overall Progress</span>
                <span className="font-bold">{overallProgress.toFixed(1)}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <p className="text-xs text-purple-100">Target</p>
                <p className="font-bold">€{totalTarget.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <p className="text-xs text-purple-100">Remaining</p>
                <p className="font-bold">€{(totalTarget - totalSaved).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards column */}
        <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4">
          {/* Goals count card */}
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-lg border-2 border-purple-100 relative overflow-hidden group hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-full -ml-8 -mb-8 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center text-2xl transform -rotate-6 group-hover:rotate-0 transition-transform shadow-lg">
                  📊
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Active Goals</p>
              <p className="text-3xl font-bold text-gray-800 mt-1 bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
                {goals.length}
              </p>
            </div>
          </div>

          {/* Completed goals card */}
          <div className="bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-3xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl transform rotate-6 group-hover:rotate-0 transition-transform">
                  🏆
                </div>
              </div>
              <p className="text-pink-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1">
                {completedGoals}
              </p>
              <p className="text-pink-100 text-xs mt-1">
                {goals.length > 0 ? ((completedGoals / goals.length) * 100).toFixed(0) : 0}% success rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Button with creative style */}
      <button
        onClick={() => openModal()}
        className="w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 text-white font-bold py-4 px-8 rounded-2xl mb-8 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
        <span className="relative">Create New Goal</span>
      </button>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[20rem] transform rotate-12">🎯</div>
          </div>
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-violet-300 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl animate-bounce">
              🎯
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">No savings goals yet</p>
            <p className="text-gray-400">Create your first goal and start saving!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {goals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;
            const daysLeft = goal.deadline
              ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            const colors = [
              { gradient: "from-purple-400 via-violet-400 to-fuchsia-500", accent: "purple", ring: "ring-purple-200" },
              { gradient: "from-fuchsia-400 via-pink-400 to-rose-500", accent: "fuchsia", ring: "ring-fuchsia-200" },
              { gradient: "from-violet-400 via-purple-400 to-indigo-500", accent: "violet", ring: "ring-violet-200" },
              { gradient: "from-pink-400 via-rose-400 to-red-500", accent: "pink", ring: "ring-pink-200" },
              { gradient: "from-indigo-400 via-blue-400 to-cyan-500", accent: "indigo", ring: "ring-indigo-200" },
            ];
            const color = colors[index % colors.length];

            const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"];
            const rotation = rotations[index % rotations.length];

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all border-2 ${
                  isCompleted ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" : "border-gray-100"
                } relative overflow-hidden group transform hover:-translate-y-2 hover:${rotation}`}
              >
                {/* Decorative elements */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color.gradient} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br ${color.gradient} opacity-5 rounded-tr-full`}></div>
                
                {/* Completed badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    ✨ Complete!
                  </div>
                )}

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className={`w-16 h-16 bg-gradient-to-br ${color.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 transform -rotate-6 group-hover:rotate-6 transition-transform shadow-lg ${color.ring} ring-4`}>
                        {goal.icon || "🎯"}
                      </div>
                      <h3 className="font-bold text-gray-800 text-xl mb-1">{goal.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(goal)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Amount display */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent`}>
                        €{goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        / €{goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 font-medium">Progress</span>
                      <span className={`font-bold bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent`}>
                        {Math.min(progress, 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${isCompleted ? "from-green-400 to-emerald-500" : color.gradient} rounded-full transition-all duration-700 relative`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      >
                        {!isCompleted && (
                          <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags and deadline */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-full">
                      💰 €{(goal.targetAmount - goal.currentAmount).toFixed(2)} to go
                    </span>
                    {daysLeft !== null && (
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        daysLeft < 0 
                          ? "bg-red-100 text-red-600" 
                          : daysLeft < 30 
                            ? "bg-orange-100 text-orange-600" 
                            : "bg-green-100 text-green-600"
                      }`}>
                        📅 {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    )}
                  </div>

                  {/* Contribute button */}
                  {!isCompleted && (
                    <button
                      onClick={() => openContributeModal(goal)}
                      className={`w-full bg-gradient-to-r ${color.gradient} text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] group/btn relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        <span>💵</span> Add Funds
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Decorative header background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-400 via-violet-400 to-fuchsia-500 opacity-10 rounded-t-3xl"></div>
            
            <div className="p-6 md:p-8 relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {editingGoal ? "Edit Goal" : "New Goal"} 🎯
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {editingGoal ? "Update your savings goal" : "Set a new savings target"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-all hover:rotate-90"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Icon selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Choose an Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                          formData.icon === icon
                            ? "bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg scale-110 ring-4 ring-purple-200"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., New Laptop, Emergency Fund"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Already Saved
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-6"
                >
                  {editingGoal ? "Update Goal" : "Create Goal"} ✨
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {isContributeModalOpen && selectedGoalForContribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Decorative header */}
            <div className="bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <button
                onClick={closeContributeModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                ✕
              </button>
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {selectedGoalForContribution.icon || "🎯"}
                </div>
                <h2 className="text-2xl font-bold">Add to Savings</h2>
                <p className="text-purple-100 mt-1">{selectedGoalForContribution.name}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Current Balance</span>
                  <span className="text-2xl font-bold text-gray-800">
                    €{selectedGoalForContribution.currentAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500">Remaining</span>
                  <span className="text-lg font-semibold text-purple-600">
                    €{(selectedGoalForContribution.targetAmount - selectedGoalForContribution.currentAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Amount to Add
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-3xl font-bold text-center"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Add Funds 💰
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
