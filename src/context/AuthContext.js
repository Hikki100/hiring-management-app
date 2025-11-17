"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import usersData from "@/data/users.json";

// Bikin Context
const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cek apakah user sudah login (dari localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fungsi Login
  const login = (email, password) => {
    // Cari user di data
    const foundUser = usersData.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Hapus password sebelum disimpan (buat keamanan)
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };

      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      // Redirect sesuai role
      if (foundUser.role === "admin") {
        router.push("/admin/jobs");
      } else {
        router.push("/user/jobs");
      }

      return { success: true };
    } else {
      return { success: false, message: "Email atau password salah!" };
    }
  };

  // Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook untuk pakai Auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
