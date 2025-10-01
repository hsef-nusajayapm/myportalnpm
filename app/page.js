"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CarouselLogin from "../components/shared/CarouselLogin";

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
      router.push("/dashboard");
    }
  }, [router]);

  // URL Web App Google Apps Script
  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbzY-TAseFX3VWfH4wbu7N9oKcE6h0CyKHWXYluHVxcHm_s704kECE1sAE6aQFslP-kF/exec";

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
      const res = await fetch(
        `${WEB_APP_URL}?action=login&email=${encodeURIComponent(email.toLowerCase().trim())}&password=${encodeURIComponent(password.trim())}`
      );
      const result = await res.json();

      if (result.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", email);
        router.push("/dashboard");
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="animate-float flex items-center justify-center shadow-xl">
        {/* Carousel */}
        <div className="container mx-auto grid max-w-2xl grid-cols-1 overflow-hidden rounded-lg bg-white shadow-2xl md:grid-cols-2">
          <div className="relative col-span-1 hidden h-full overflow-hidden bg-cover bg-center md:block">
            <CarouselLogin />
          </div>
          {/* Form */}
          <div className="col-span-1 flex-col justify-center p-6 md:p-8">
            <h2 className="mb-0.5 text-center text-2xl font-bold text-gray-800">
              Hello!👋, Welcome to
            </h2>
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
              Nusajaya Persadatama Mandiri
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative mb-6">
                <i className="fa-solid fa-envelope absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:ring-black focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password */}
              <div className="relative">
                <i className="fa-solid fa-lock absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-12 focus:ring-black focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 focus:outline-none"
                >
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

              <div className="w-full grid-cols-1 pt-3 lg:mx-auto lg:w-1/2 lg:grid-cols-2">
                {!loading ? (
                  <button
                    type="submit"
                    className="transition-duration-500 w-full rounded-full bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-700 focus:outline-none"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full items-center justify-center rounded-full bg-indigo-600 py-4 font-semibold text-white"
                    disabled
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="me-3 inline h-4 w-4 animate-spin text-gray-200"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading…
                  </button>
                )}
              </div>
              {errorMsg && <div className="mt-4 text-center text-sm text-red-500">{errorMsg}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
