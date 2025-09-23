"use client";
import Image from "next/image";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="py-2 px-4 h-[72px] justify-between items-center shadow-2xs sticky top-0 z-10 flex w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="container flex justify-between items-center mx-auto">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-gray-700 items-center px-4 focus:outline-none md:hidden mr-2">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Image
            src="/img/Logo NPM-01 PNG.svg" // pastikan path di /public/img
            alt="logo"
            width={120} // sesuaikan ukuran logo
            height={40} // sesuaikan tinggi logo
            className="bg-amber-50 rounded-md ml-3 flex-shrink-0 items-center"
          />
          <p className="ml-2 text-xl md:text-2xl text-white hidden md:block">NUSAJAYA</p>
          <strong className="text-lg md:text-2xl ml-1 text-white hidden md:block"> PERSADATAMA MANDIRI</strong>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn");
              sessionStorage.removeItem("userEmail");
              window.location.href = "/";
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex px-4 py-2 text-sm rounded-full transition-all"
          >
            <div className="mr-3 flex-shrink-0 self-center justify-between">
              <i className="fa fa-power-off" aria-hidden="true"></i>
            </div>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
