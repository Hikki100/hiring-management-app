"use client";

import { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Calendar,
  GripVertical,
} from "lucide-react";

export default function CandidateTable({ candidates, jobTitle }) {
  const [columns] = useState([
    { id: "full_name", label: "Nama Lengkap", width: 200 },
    { id: "email", label: "Email", width: 250 },
    { id: "phone", label: "Telepon", width: 180 },
    { id: "gender", label: "Gender", width: 120 },
    { id: "domicile", label: "Domisili", width: 150 },
    { id: "linkedin", label: "LinkedIn", width: 200 },
    { id: "applied_date", label: "Tanggal Melamar", width: 180 },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(candidates);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let result = candidates;
    if (searchQuery) {
      result = result.filter((candidate) =>
        Object.values(candidate).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchQuery, candidates]);

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = String(a[sortConfig.key] || "");
    const bValue = String(b[sortConfig.key] || "");
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-dark">
            Pelamar: {jobTitle || "Semua Lowongan"}
          </h3>
          <p className="text-sm text-gray-600">
            Total {filteredData.length} kandidat
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kandidat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="relative px-4 py-3 text-left text-sm font-semibold text-gray-700 select-none"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <button
                        onClick={() => handleSort(column.id)}
                        className="flex items-center gap-2 hover:text-primary transition"
                      >
                        <span>{column.label}</span>
                        {getSortIcon(column.id)}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {candidate.full_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {candidate.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {candidate.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {candidate.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {candidate.domicile}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <a
                        href={candidate.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Lihat Profil
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(candidate.applied_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold">
                      Tidak ada kandidat ditemukan
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, sortedData.length)} dari{" "}
              {sortedData.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
