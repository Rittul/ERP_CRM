import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../css/Layout.css";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar  = () => setSidebarOpen(false);

    return (
        <div className="app-layout">

            {/* Mobile hamburger button */}
            <button
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? "✕" : "☰"}
            </button>

            {/* Overlay (mobile only) */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Page content */}
            <main className="app-content">
                <Outlet />
            </main>

        </div>
    );
};

export default Layout;