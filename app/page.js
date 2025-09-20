"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CarouselLogin from "../components/CarouselLogin"; 

export default function LoginPage() {
  const router = useRouter();

  // State form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cek status login
  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn")) {
      router.push("/home");
    }
  }, [router]);

  // URL Web App Google Apps Script
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwZWtr1i91W6hUOoIqUtJFmPYoflmyoFVohKTeMM4YsyL-E_L15TsjKdbkTmG-H98st/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Format email tidak valid!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${WEB_APP_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const result = await res.json();

      if (result.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", email);
        router.push("/home");
      } else {
        setErrorMsg(result.message || "Email atau password salah!");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex items-center justify-center px-6">
        {/* Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-lg container mx-auto max-w-3xl bg-white shadow-2xl overflow-hidden">
          <div className="hidden md:block col-span-1 bg-cover bg-center h-full min-h-[470px] relative overflow-hidden">
            <CarouselLogin  />
          </div>
          {/* Form */}
          <div className="col-span-1 p-8 flex-col justify-center md:p-10">
            <h2 className="text-2xl font-bold mb-0.5 text-gray-800 text-center">Hello!👋, Welcome to</h2>
            <h2 className="text-xl font-semibold mb-8 text-gray-800 text-center">Nusajaya Persadatama Mandiri</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="mb-6 relative">
                <i className="fa-solid absolute fa-envelope left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password */}
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 focus:outline-none">
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {/* Remember me */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="h-4 w-4" />
                <label className="text-gray-600" htmlFor="remember">
                  Remember Me
                </label>
              </div>

              <div className="w-full lg:w-1/2 lg:mx-auto grid-cols-1 lg:grid-cols-2">
                {!loading ? (
                  <button
                    type="submit"
                    className="py-3 w-full font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-duration-500"
                  >
                    Login
                  </button>
                ) : (
                  <button type="button" className="bg-indigo-600 py-3 font-semibold rounded-full w-full text-white items-center justify-center" disabled>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908Z" fill="currentColor" />
                    </svg>
                    Processing…
                  </button>
                )}
              </div>
              {errorMsg && <div className="text-red-500 text-sm text-center mt-4">{errorMsg}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

