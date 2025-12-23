import React from "react";
import { Link } from "react-router-dom";
import { Receipt, Beaker, Cable, Wrench, LucideIcon } from "lucide-react";
import { ROUTES } from "@/components/AppRoutes";

interface NavCardProps {
  to: string;
  title: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const NavCard: React.FC<NavCardProps> = ({
  to,
  title,
  icon: Icon,
  description,
  color,
}) => {
  return (
    <Link
      to={to}
      className="group block p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:bg-slate-700/60 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}
        >
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const NavigationCards: React.FC = () => {
  const navItems = [
    {
      to: ROUTES.CONNECTORS,
      title: "Connectors",
      icon: Cable,
      description: "Browse and manage connector stock",
      color: "bg-purple-500",
    },
    {
      to: ROUTES.ACCESSORIES,
      title: "Accessories",
      icon: Wrench,
      description: "Accessory inventory and controls",
      color: "bg-orange-500",
    },
    {
      to: ROUTES.SAMPLES,
      title: "Samples",
      icon: Beaker,
      description: "View and register project samples",
      color: "bg-emerald-500",
    },
    {
      to: ROUTES.TRANSACTIONS,
      title: "Transactions",
      icon: Receipt,
      description: "Manage stock movements and history",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-12 w-full max-w-4xl mx-auto">
      {navItems.map((item) => (
        <NavCard key={item.to} {...item} />
      ))}
    </div>
  );
};
