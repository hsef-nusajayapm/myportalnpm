"use client";
import { FaHome, FaFileAlt, FaHistory, FaUserShield, FaUser } from "react-icons/fa";

export default function Sidebar({ isCollapsed, toggleSidebar, activeMenu, setActiveMenu }) {
  return (
    <aside
      className={`bg-violet-500 text-white h-screen sticky transition-all sidebar-transition duration-700 top-0 z-50 flex flex-col 
        ${isCollapsed ? "w-16" : "w-64"} 
        ${isCollapsed ? "max-md:-translate-x-full" : "max-md:translate-x-0"}  max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:z-50 max-md:shadow-lg`}
    >
      <div className="flex items-center justify-between px-4 h-[72px] border-b border-purple-700 overflow">
        {!isCollapsed && <h2 className="text-xl font-bold transition-opacity duration-700 collapsible-text">PORTAL</h2>}
        <button onClick={toggleSidebar} className="text-white focus:outline-none item center" aria-label="Toggle Sidebar">
          <i className="fas fa-bars ml-1"></i>
        </button>
      </div>
      <nav className="mt-4">
        <button onClick={() => setActiveMenu("dashboard")} className={`flex items-center w-full px-4 py-3 hover:bg-pink-700 transition-colors ${activeMenu === "dashboard" ? "bg-pink-700" : ""}  ${isCollapsed ? "justify-center" : "items-center px-4"}`}>
          <FaHome className="mr-3" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute w-0" : "opacity-100"}`}>Dashboard</span>
        </button>

        <button onClick={() => setActiveMenu("formPortal")} className={`flex items-center w-full px-4 py-3 hover:bg-pink-700 transition-colors ${activeMenu === "formPortal" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}>
          <FaFileAlt className="mr-3" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute w-0" : "opacity-100"}`}>Form Portal</span>
        </button>

        <button
          onClick={() => setActiveMenu("formCommissioning")}
          className={`flex items-center w-full px-4 py-3 hover:bg-pink-700 transition-colors ${activeMenu === "formCommissioning" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}
        >
          <FaHistory className="mr-3" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute w-0" : "opacity-100"}`}>Form Commissioning</span>
        </button>

        <button onClick={() => setActiveMenu("formEscort")} className={`flex items-center w-full px-4 py-3 hover:bg-pink-700 transition-colors ${activeMenu === "formEscort" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}>
          <FaUserShield className="mr-3" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute w-0" : "opacity-100"}`}>Form Escort</span>
        </button>

        <button onClick={() => setActiveMenu("visitor")} className={`flex items-center w-full px-4 py-3 hover:bg-pink-700 transition-colors ${activeMenu === "visitor" ? "bg-pink-700" : ""} ${isCollapsed ? "justify-center" : "items-center px-4"}`}>
          <FaUser className="mr-3" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0 absolute w-0" : "opacity-100"}`}>Visitor</span>
        </button>
      </nav>
    </aside>
  );
}
