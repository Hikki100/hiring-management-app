"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CandidateTable from "@/components/CandidateTable";
import candidatesData from "@/data/candidates.json";
import jobsData from "@/data/jobs.json";
import { Users, Briefcase } from "lucide-react";

export default function CandidatesPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const jobFromUrl = searchParams.get("job");
  const [selectedJob, setSelectedJob] = useState(jobFromUrl || "all");

  // Cek apakah user adalah admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Filter candidates by job
  const filteredCandidates =
    selectedJob === "all"
      ? candidatesData
      : candidatesData.filter((c) => c.job_id === selectedJob);

  const selectedJobData = jobsData.find((j) => j.id === selectedJob);

  return (
    <div className="min-h-screen bg-light">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/jobs")}
                className="text-gray-700 hover:text-primary transition font-medium"
              >
                ← Kembali ke Jobs
              </button>
              <span className="text-gray-700">
                Halo, <strong>{user.name}</strong>
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Manajemen Kandidat
          </h2>
          <p className="text-gray-600">
            Kelola semua pelamar untuk lowongan pekerjaan
          </p>
        </div>

        {/* Job Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <label className="font-semibold text-gray-700">
              Filter berdasarkan Lowongan:
            </label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition cursor-pointer"
            >
              <option value="all">
                Semua Lowongan ({candidatesData.length} kandidat)
              </option>
              {jobsData.map((job) => {
                const count = candidatesData.filter(
                  (c) => c.job_id === job.id
                ).length;
                return (
                  <option key={job.id} value={job.id}>
                    {job.title} ({count} kandidat)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-1">Total Pelamar</p>
            <p className="text-3xl font-bold text-dark">
              {candidatesData.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-1">Lowongan Aktif</p>
            <p className="text-3xl font-bold text-green-600">
              {jobsData.filter((j) => j.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <p className="text-gray-600 text-sm mb-1">
              {selectedJob === "all" ? "Rata-rata per Job" : "Pelamar Job Ini"}
            </p>
            <p className="text-3xl font-bold text-primary">
              {selectedJob === "all"
                ? Math.round(candidatesData.length / jobsData.length)
                : filteredCandidates.length}
            </p>
          </div>
        </div>

        {/* Candidate Table */}
        <CandidateTable
          candidates={filteredCandidates}
          jobTitle={selectedJobData?.title}
        />
      </div>
    </div>
  );
}
