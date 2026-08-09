import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleLinkClick = () => {
        // Close mobile sidebar when a link is clicked
        if (onClose) onClose();
    };

    return (
        <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

            {/* Logo */}
            <div className="sidebar-logo">
                <h2>ERP CRM</h2>
            </div>


            {/* Navigation */}
            <nav className="sidebar-navigation">

                <NavLink
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/customers"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Customers
                </NavLink>

                <NavLink
                    to="/products"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Products
                </NavLink>

                <NavLink
                    to="/inventory"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Inventory
                </NavLink>

                <NavLink
                    to="/challans"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Challans
                </NavLink>

            </nav>


            {/* Bottom */}
            <div className="sidebar-bottom">
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

        </div>
    );

};

export default Sidebar;