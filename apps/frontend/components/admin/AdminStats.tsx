import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, change, icon: Icon, trend }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-green-50 rounded-xl">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span
        className={`font-medium ${
          trend === "up"
            ? "text-green-600"
            : trend === "down"
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {change}
      </span>
      <span className="text-gray-500 ml-2">from last month</span>
    </div>
  </div>
);

export default function AdminStats() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Active Listings",
      value: "856",
      change: "+5%",
      icon: Package,
      trend: "up" as const,
    },
    {
      title: "Total Sales",
      value: "Rs 45,200",
      change: "+18%",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
        title: "Total Purchases",
        value: "342",
        change: "-2%",
        icon: ShoppingBag,
        trend: "down" as const,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
