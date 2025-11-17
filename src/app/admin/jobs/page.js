"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import Modal from "@/components/Modal";
import jobsData from "@/data/jobs.json";
import { Search, Plus, Filter, Save, Info } from "lucide-react";

export default function AdminJobsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // State untuk jobs dan filtering
  const [jobs, setJobs] = useState(jobsData);
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State untuk Create Job Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    requirements: "",
    status: "draft",
    salary_min: "",
    salary_max: "",
    // Field configuration
    fields: {
      full_name: "mandatory",
      email: "mandatory",
      phone: "mandatory",
      gender: "optional",
      domicile: "optional",
      linkedin: "optional",
      date_of_birth: "optional",
      photo: "optional",
    },
  });

  // Cek apakah user adalah admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Filter jobs berdasarkan search dan status
  useEffect(() => {
    let result = jobs;

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(result);
  }, [searchQuery, statusFilter, jobs]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle field configuration change
  const handleFieldConfigChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldKey]: value,
      },
    }));
  };

  // Handle create job
  const handleCreateJob = () => {
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setFormData({
      title: "",
      department: "",
      description: "",
      requirements: "",
      status: "draft",
      salary_min: "",
      salary_max: "",
      fields: {
        full_name: "mandatory",
        email: "mandatory",
        phone: "mandatory",
        gender: "optional",
        domicile: "optional",
        linkedin: "optional",
        date_of_birth: "optional",
        photo: "optional",
      },
    });
  };

  // Handle save job
  const handleSaveJob = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.department ||
      !formData.salary_min ||
      !formData.salary_max
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    // Create new job object
    const newJob = {
      id: `job_${Date.now()}`,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
      title: formData.title,
      department: formData.department,
      status: formData.status,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter((r) => r.trim()),
      salary_range: {
        min: parseInt(formData.salary_min),
        max: parseInt(formData.salary_max),
        currency: "IDR",
        display_text: `Rp ${parseInt(formData.salary_min).toLocaleString(
          "id-ID"
        )} - Rp ${parseInt(formData.salary_max).toLocaleString("id-ID")}`,
      },
      created_at: new Date().toISOString().split("T")[0],
      application_form: {
        fields: Object.entries(formData.fields)
          .filter(([_, value]) => value !== "off")
          .map(([key, value]) => ({
            key,
            label: key
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            required: value === "mandatory",
          })),
      },
    };

    // Add to jobs array
    setJobs((prev) => [newJob, ...prev]);

    // Show success message
    alert(`✅ Job "${newJob.title}" berhasil dibuat!`);

    // Close modal
    handleCloseModal();
  };

  // Handle manage job
  const handleManageJob = (job) => {
    // Redirect ke halaman candidates dengan filter job ini
    router.push(`/admin/candidates?job=${job.id}`);
  };
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

  // Field labels untuk form configuration
  const fieldLabels = {
    full_name: "Nama Lengkap",
    email: "Email",
    phone: "Nomor Telepon",
    gender: "Jenis Kelamin",
    domicile: "Domisili",
    linkedin: "LinkedIn",
    date_of_birth: "Tanggal Lahir",
    photo: "Foto Profil",
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-primary">
                Admin Dashboard
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/admin/jobs")}
                  className="px-4 py-2 text-primary border-b-2 border-primary font-semibold"
                >
                  Jobs
                </button>
                <button
                  onClick={() => router.push("/admin/candidates")}
                  className="px-4 py-2 text-gray-600 hover:text-primary transition font-semibold"
                >
                  Candidates
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">
            Daftar Lowongan Pekerjaan
          </h2>
          <p className="text-gray-600">
            Kelola semua lowongan pekerjaan di sini
          </p>
        </div>

        {/* Search, Filter & Create Button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau departemen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition cursor-pointer appearance-none bg-white min-w-[150px]"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={handleCreateJob}
              className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-dark">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {jobs.filter((j) => j.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">
              {jobs.filter((j) => j.status === "draft").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-red-600">
              {jobs.filter((j) => j.status === "inactive").length}
            </p>
          </div>
        </div>

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onManage={handleManageJob} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Buat Lowongan Baru"
      >
        <form onSubmit={handleSaveJob} className="space-y-6">
          {/* Job Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Informasi Lowongan
            </h3>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Pekerjaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Contoh: Frontend Developer"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Contoh: Engineering"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Minimum (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleInputChange}
                  placeholder="7000000"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Maximum (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleInputChange}
                  placeholder="10000000"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Deskripsi pekerjaan..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (satu per baris)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Minimal 2 tahun pengalaman&#10;Menguasai React&#10;Familiar dengan Git"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Field Configuration Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-dark mb-4">
              Konfigurasi Form Lamaran
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Atur field mana yang wajib, opsional, atau disembunyikan untuk
              pelamar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">{label}</span>
                  <select
                    value={formData.fields[key]}
                    onChange={(e) =>
                      handleFieldConfigChange(key, e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                  >
                    <option value="mandatory">Wajib</option>
                    <option value="optional">Opsional</option>
                    <option value="off">Off</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Simpan Lowongan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
