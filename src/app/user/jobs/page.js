"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import jobsData from "@/data/jobs.json";
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  ChevronRight,
} from "lucide-react";

export default function UserJobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Filter hanya job yang active
  const activeJobs = jobsData.filter((job) => job.status === "active");

  // Filter berdasarkan search
  useEffect(() => {
    let result = activeJobs;

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchQuery]);

  // Set initial filtered jobs
  useEffect(() => {
    setFilteredJobs(activeJobs);
  }, []);

  const handleApplyJob = (jobId) => {
    if (!user) {
      // Kalau belum login, redirect ke login
      router.push("/login");
    } else {
      // Kalau sudah login, ke halaman apply
      router.push(`/user/apply/${jobId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Temukan Pekerjaan Impianmu
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Jelajahi lowongan pekerjaan terbaik dari perusahaan ternama
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Cari posisi atau departemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-800 text-lg focus:ring-4 focus:ring-white/30 outline-none shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark mb-2">
            Lowongan Tersedia
          </h2>
          <p className="text-gray-600">
            {filteredJobs.length} posisi menunggu untuk kamu lamar
          </p>
        </div>

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-primary group"
                onClick={() => handleApplyJob(job.id)}
              >
                {/* Job Title */}
                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition">
                  {job.title}
                </h3>

                {/* Department */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{job.department}</span>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-800">
                    {job.salary_range.display_text}
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {job.description ||
                    "Bergabunglah dengan tim kami untuk mengembangkan karir Anda!"}
                </p>

                {/* Posted Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Dibuka:{" "}
                    {new Date(job.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                {/* Apply Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyJob(job.id);
                  }}
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  Lamar Sekarang
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau cek kembali nanti
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Job Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
