"use client";
import AdminStats from "@/components/admin/AdminStats";
import AdminCharts from "@/components/admin/AdminCharts";
import UserManagementTable from "@/components/admin/UserManagementTable";
import ReportedItemsTable from "@/components/admin/ReportedItemsTable";
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your platform's performance and management</p>
        </div>
        <AdminStats />
        <AdminCharts />
        
        <div className="grid grid-cols-1 gap-8">
            <UserManagementTable />
            <ReportedItemsTable />
        </div>
      </div>
    </div>
  );
}