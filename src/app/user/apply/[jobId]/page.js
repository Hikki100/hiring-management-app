"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import jobsData from "@/data/jobs.json";
import WebcamCapture from "@/components/WebcamCapture";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
} from "lucide-react";

export default function ApplyJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [photoData, setPhotoData] = useState(null);

  // Cek apakah user sudah login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load job data
  useEffect(() => {
    const loadJobData = async () => {
      try {
        // Dynamic import
        const { default: jobsData } = await import("@/data/jobs.json");

        console.log("🔍 All Jobs:", jobsData);
        console.log("🎯 Looking for:", jobId);

        const foundJob = jobsData.find((j) => j.id === jobId);
        console.log("📦 Found Job:", foundJob);

        if (foundJob) {
          if (!foundJob.application_form?.fields) {
            console.error("❌ Invalid structure");
            router.push("/user/jobs");
            return;
          }

          setJob(foundJob);

          const initialData = {};
          foundJob.application_form.fields.forEach((field) => {
            initialData[field.key] = "";
          });
          setFormData(initialData);
        } else {
          router.push("/user/jobs");
        }
      } catch (error) {
        console.error("❌ Error loading jobs:", error);
        router.push("/user/jobs");
      }
    };

    loadJobData();
  }, [jobId, router]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error untuk field ini
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    job.application_form.fields.forEach((field) => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} wajib diisi`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect ke job list setelah 3 detik
      setTimeout(() => {
        router.push("/user/jobs");
      }, 3000);
    }, 1500);
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-dark mb-4">
              Lamaran Berhasil Dikirim! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Terima kasih telah melamar posisi <strong>{job.title}</strong>.
              <br />
              Tim HRD kami akan menghubungi Anda segera.
            </p>
            <button
              onClick={() => router.push("/user/jobs")}
              className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg transition font-semibold"
            >
              Kembali ke Daftar Lowongan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/user/jobs")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Lowongan
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-dark mb-4">{job.title}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    {job.salary_range.display_text}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>
                    Dibuka:{" "}
                    {new Date(job.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-dark mb-3">Deskripsi</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {job.description || "Tidak ada deskripsi"}
                </p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-dark mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-dark mb-2">
                Form Lamaran
              </h3>
              <p className="text-gray-600 mb-6">
                Lengkapi data berikut untuk melamar posisi ini
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {job.application_form.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      {!field.required && (
                        <span className="text-gray-400 text-xs ml-2">
                          (Opsional)
                        </span>
                      )}
                    </label>

                    {field.key === "gender" ? (
                      <select
                        name={field.key}
                        value={formData[field.key]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
                      >
                        <option value="">Pilih Gender</option>
                        <option value="Male">Laki-laki</option>
                        <option value="Female">Perempuan</option>
                      </select>
                    ) : field.key === "date_of_birth" ? (
                      <input
                        type="date"
                        name={field.key}
                        value={formData[field.key]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
                      />
                    ) : field.key === "photo" ? (
                      <div>
                        <WebcamCapture
                          onPhotoCapture={(imageData) => {
                            setPhotoData(imageData);
                            setFormData((prev) => ({
                              ...prev,
                              photo: imageData,
                            }));
                          }}
                          required={field.required}
                        />
                      </div>
                    ) : (
                      <input
                        type={
                          field.key === "email"
                            ? "email"
                            : field.key === "phone"
                            ? "tel"
                            : "text"
                        }
                        name={field.key}
                        value={formData[field.key]}
                        onChange={handleInputChange}
                        required={field.required}
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                        className={`w-full px-4 py-3 border ${
                          errors[field.key]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
                      />
                    )}

                    {errors[field.key] && (
                      <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[field.key]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim Lamaran
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
