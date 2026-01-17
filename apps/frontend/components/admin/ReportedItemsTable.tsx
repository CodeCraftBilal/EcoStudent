"use client";

import { Eye, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

const initialReports = [
  { id: 1, item: "Used Calculator", reportedBy: "Ali Khan", reason: "Inappropriate Content", date: "2024-01-16", status: "Pending" },
  { id: 2, item: "Biology Textbook", reportedBy: "Sara Ahmed", reason: "Fake Item", date: "2024-01-15", status: "Pending" },
  { id: 3, item: "School Bag", reportedBy: "John Doe", reason: "Scam", date: "2024-01-14", status: "Resolved" },
];

export default function ReportedItemsTable() {
  const [reports, setReports] = useState(initialReports);

  const handleAction = (id: number, action: 'resolve' | 'delete') => {
      // In a real app, this would call an API
      if (action === 'resolve') {
          setReports(reports.map(r => r.id === id ? {...r, status: 'Resolved'} : r));
      } else {
        if(confirm('Are you sure you want to delete this report?')) {
          setReports(reports.filter(r => r.id !== id));
        }
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Reported Listings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.item}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {report.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.reportedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1" title="View Item">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleAction(report.id, 'resolve')} className="text-green-600 hover:text-green-900 p-1" title="Resolve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleAction(report.id, 'delete')} className="text-red-600 hover:text-red-900 p-1" title="Delete Item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
