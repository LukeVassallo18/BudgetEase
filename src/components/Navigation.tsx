import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/income", icon: "💰", label: "Income" },
  { path: "/expenses", icon: "💸", label: "Expenses" },
  { path: "/savings", icon: "🎯", label: "Goals" },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-2 pt-2 z-40">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
