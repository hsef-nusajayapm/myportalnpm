"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "./page.module.css";

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex flex-grow">
      <Sidebar styles={styles} isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-grow flex-col transition-all duration-500">
        <Navbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main className="flex-grow bg-gray-100 p-4">
          {activeMenu === "dashboard" && <div className="bg-white rounded p-4 shadow min-h-screen">📊 Grafik dashboard</div>}
          {activeMenu === "formPortal" && (
            <div className="bg-white rounded p-4 shadow min-h-screen">
              <div className="container mx-auto max-w-4xl">
                <div className="relative w-full" style={{ paddingBottom: "80vh" }}>
                  <iframe
                    src="https://tally.so/embed/mOqMG7?alignLeft=1&transparentBackground=1&dynamicHeight=1"
                    className="w-full min-h-[800px] rounded"
                    frameBorder="0"
                    title="Form Portal"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
          {activeMenu === "formCommissioning" && <div className="bg-white rounded p-4 shadow min-h-screen">Form Commissioning</div>}
          {activeMenu === "formEscort" && <div className="bg-white rounded p-4 shadow min-h-screen">Form Escort</div>}
          {activeMenu === "visitor" && <div className="bg-white rounded p-4 shadow min-h-screen">Visitor</div>}
        </main>
        <Footer />
      </div>
    </div>
  );
}
