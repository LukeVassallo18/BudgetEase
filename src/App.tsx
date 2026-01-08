import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ExpenseTracking from "./components/ExpenseTracking";
import IncomeManagement from "./components/IncomeManagement";
import Navigation from "./components/Navigation";
import SavingsGoals from "./components/SavingsGoals";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/income" element={<IncomeManagement />} />
          <Route path="/expenses" element={<ExpenseTracking />} />
          <Route path="/savings" element={<SavingsGoals />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
