"use client";
import Image from "next/image";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-10 flex h-[72px] w-full items-center justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 shadow-2xs">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-2 items-center px-4 text-gray-700 focus:outline-none md:hidden"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Image
            src="/img/Logo NPM-01 PNG.svg" // pastikan path di /public/img
            alt="logo"
            width={120} // sesuaikan ukuran logo
            height={40} // sesuaikan tinggi logo
            className="ml-3 flex-shrink-0 items-center rounded-md bg-amber-50"
          />
          <p className="ml-2 hidden text-xl text-white md:block md:text-2xl">NUSAJAYA</p>
          <strong className="ml-1 hidden text-lg text-white md:block md:text-2xl">
            {" "}
            PERSADATAMA MANDIRI
          </strong>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn");
              sessionStorage.removeItem("userEmail");
              window.location.href = "/";
            }}
            className="flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
          >
            <div className="mr-3 flex-shrink-0 justify-between self-center">
              <i className="fa fa-power-off" aria-hidden="true"></i>
            </div>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
