"use client";

import { Briefcase, DollarSign, Calendar } from "lucide-react";

export default function JobCard({ job, onManage }) {
  // Fungsi untuk warna badge berdasarkan status
  const getBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-300";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Format status text
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      {/* Header dengan Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark mb-2">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{job.department}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
            job.status
          )}`}
        >
          {getStatusText(job.status)}
        </span>
      </div>

      {/* Salary Range */}
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <span className="font-semibold">{job.salary_range.display_text}</span>
      </div>

      {/* Created Date */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>
          Dibuat: {new Date(job.created_at).toLocaleDateString("id-ID")}
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onManage(job)}
        className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-lg transition duration-200"
      >
        Manage Job
      </button>
    </div>
  );
}
