"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

const userActivityData = [
  { name: "Jan", users: 400, items: 240 },
  { name: "Feb", users: 300, items: 139 },
  { name: "Mar", users: 200, items: 980 },
  { name: "Apr", users: 278, items: 390 },
  { name: "May", users: 189, items: 480 },
  { name: "Jun", users: 239, items: 380 },
  { name: "Jul", users: 349, items: 430 },
];

const categoryData = [
  { name: "Books", value: 400 },
  { name: "Uniforms", value: 300 },
  { name: "Electronics", value: 300 },
  { name: "Stationery", value: 200 },
];

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];


const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Activity</h3>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="items"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Item Categories</h3>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Revenue</h3>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
