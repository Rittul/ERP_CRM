import { useEffect, useState } from "react";
import api from "../utils/api";
import "../css/Dashboard.css";
const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [challans, setChallans] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    customersResponse,
                    productsResponse,
                    lowStockResponse,
                    challansResponse
                ] = await Promise.all([
                    api.get("/customers"),

                    api.get("/products"),

                    api.get("/products?lowStock=true"),

                    api.get("/challan?page=1&limit=5")
                ]);

                setCustomers(
                    customersResponse.data.customers || []
                );

                setProducts(
                    productsResponse.data.products || []
                );

                setLowStockProducts(
                    lowStockResponse.data.products || []
                );

                setChallans(
                    challansResponse.data.challans || []
                );

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* Header */}

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Overview of your CRM and inventory system
                    </p>
                </div>
            </div>


            {/* Statistics */}

            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-card-content">
                        <h3>Total Customers</h3>
                        <p>{customers.length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-content">
                        <h3>Total Products</h3>
                        <p>{products.length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-content">
                        <h3>Low Stock</h3>
                        <p>{lowStockProducts.length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-content">
                        <h3>Recent Challans</h3>
                        <p>{challans.length}</p>
                    </div>
                </div>

            </div>


            {/* Main Dashboard Content */}

            <div className="dashboard-content">

                {/* Low Stock */}

                <section className="dashboard-section">

                    <div className="section-header">
                        <h2>Low Stock Products</h2>
                    </div>

                    {lowStockProducts.length === 0 ? (
                        <div className="empty-state">
                            <p>No low stock products</p>
                        </div>
                    ) : (
                        <div className="dashboard-table-container">

                            <table className="dashboard-table">

                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Current Stock</th>
                                        <th>Minimum Stock</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id}>

                                            <td>
                                                {product.name}
                                            </td>

                                            <td>
                                                {product.sku}
                                            </td>

                                            <td className="low-stock-value">
                                                {product.currentStock}
                                            </td>

                                            <td>
                                                {product.minimumStock}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>


                {/* Recent Challans */}

                <section className="dashboard-section">

                    <div className="section-header">
                        <h2>Recent Challans</h2>
                    </div>

                    {challans.length === 0 ? (
                        <div className="empty-state">
                            <p>No challans found</p>
                        </div>
                    ) : (
                        <div className="dashboard-table-container">

                            <table className="dashboard-table">

                                <thead>
                                    <tr>
                                        <th>Challan Number</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Total Quantity</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {challans.map((challan) => (
                                        <tr key={challan.id}>

                                            <td>
                                                {challan.challanNumber}
                                            </td>

                                            <td>
                                                {challan.customer?.name || "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`challan-status challan-status-${challan.status?.toLowerCase()}`}
                                                >
                                                    {challan.status}
                                                </span>
                                            </td>

                                            <td>
                                                {challan.totalQuantity}
                                            </td>

                                            <td>
                                                {new Date(
                                                    challan.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
};

export default Dashboard;