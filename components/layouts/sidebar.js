"use client";
import { FaCloudscale, FaFileAlt, FaHistory, FaUserShield, FaUser } from "react-icons/fa";

export default function Sidebar({ isCollapsed, toggleSidebar, activeMenu, setActiveMenu }) {
  return (
    <aside
      className={`sidebar-transition sticky top-0 z-50 flex h-screen flex-col bg-violet-500 text-white transition-all duration-700 ${isCollapsed ? "w-16" : "w-64"} ${isCollapsed ? "max-md:-translate-x-full" : "max-md:translate-x-0"} max-md:fixed max-md:top-0 max-md:left-0 max-md:z-50 max-md:h-full max-md:shadow-lg`}
    >
      <div className="overflow flex h-[72px] items-center justify-between border-b border-purple-700 px-4">
        {!isCollapsed && (
          <h2 className="collapsible-text text-xl font-bold transition-opacity duration-700">
            PORTAL
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="item center text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <i className="fas fa-bars ml-1"></i>
        </button>
      </div>
      <nav className="mt-4">
        <button
          onClick={() => setActiveMenu("dashboard")}
          className={`flex w-full items-center px-4 py-3 transition-colors hover:bg-pink-700 ${activeMenu === "dashboard" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaCloudscale className="mr-3 max-md:-mr-3" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "absolute w-0 opacity-0" : "opacity-100"}`}
          >
            Dashboard
          </span>
        </button>

        <button
          onClick={() => setActiveMenu("formPortal")}
          className={`flex w-full items-center px-4 py-3 transition-colors hover:bg-pink-700 ${activeMenu === "formPortal" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaFileAlt className="mr-3" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "absolute w-0 opacity-0" : "opacity-100"}`}
          >
            Form Portal
          </span>
        </button>

        <button
          onClick={() => setActiveMenu("formCommissioning")}
          className={`flex w-full items-center px-4 py-3 transition-colors hover:bg-pink-700 ${activeMenu === "formCommissioning" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaHistory className="mr-3" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "absolute w-0 opacity-0" : "opacity-100"}`}
          >
            Form Commissioning
          </span>
        </button>

        <button
          onClick={() => setActiveMenu("formEscort")}
          className={`flex w-full items-center px-4 py-3 transition-colors hover:bg-pink-700 ${activeMenu === "formEscort" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaUserShield className="mr-3" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "absolute w-0 opacity-0" : "opacity-100"}`}
          >
            Form Escort
          </span>
        </button>

        <button
          onClick={() => setActiveMenu("visitor")}
          className={`flex w-full items-center px-4 py-3 transition-colors hover:bg-pink-700 ${activeMenu === "visitor" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaUser className="mr-3" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "absolute w-0 opacity-0" : "opacity-100"}`}
          >
            Visitor
          </span>
        </button>
      </nav>
    </aside>
  );
}
