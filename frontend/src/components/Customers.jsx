import { useEffect, useState } from "react";
import api from "../utils/api";
import "../css/Customer.css";

const Customers = () => {

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [showFollowupForm, setShowFollowupForm] = useState(false);

    const [customerForm, setCustomerForm] = useState({
        name: "",
        mobile: "",
        email: "",
        businessName: "",
        gstNumber: "",
        customerType: "WHOLESALE",
        address: "",
        status: "ACTIVE",
        followUpDate: ""
    });

    const [followupForm, setFollowupForm] = useState({
        note: "",
        followUpDate: ""
    });


    // get customers

    const fetchCustomers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                search
                    ? `/customers?search=${encodeURIComponent(search)}`
                    : "/customers"
            );

            setCustomers(
                response.data.customers || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load customers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCustomers();

    }, []);


    // search customers

    const handleSearch = async (e) => {

        e.preventDefault();

        await fetchCustomers();

    };


    // customer form change

    const handleCustomerChange = (e) => {

        const { name, value } = e.target;

        setCustomerForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // create or update customer

    const handleCustomerSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setMessage("");

            if (editingCustomer) {

                await api.put(
                    `/customers/${editingCustomer.id}`,
                    customerForm
                );

                setMessage(
                    "Customer updated successfully"
                );

            } else {

                await api.post(
                    "/customers",
                    customerForm
                );

                setMessage(
                    "Customer created successfully"
                );

            }

            setShowForm(false);
            setEditingCustomer(null);

            resetCustomerForm();

            await fetchCustomers();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save customer"
            );

        }
    };


    // reset customer form

    const resetCustomerForm = () => {

        setCustomerForm({
            name: "",
            mobile: "",
            email: "",
            businessName: "",
            gstNumber: "",
            customerType: "WHOLESALE",
            address: "",
            status: "ACTIVE",
            followUpDate: ""
        });

    };


    // add customer

    const openAddForm = () => {

        resetCustomerForm();

        setEditingCustomer(null);
        setShowForm(true);

        setError("");
        setMessage("");

    };


    // edit customer

    const openEditForm = (customer) => {

        setCustomerForm({
            name: customer.name || "",
            mobile: customer.mobile || "",
            email: customer.email || "",
            businessName: customer.businessName || "",
            gstNumber: customer.gstNumber || "",
            customerType: customer.customerType || "WHOLESALE",
            address: customer.address || "",
            status: customer.status || "ACTIVE",
            followUpDate: customer.followUpDate
                ? customer.followUpDate.split("T")[0]
                : ""
        });

        setEditingCustomer(customer);
        setShowForm(true);

        setError("");
        setMessage("");

    };

    // get customer by id

    const handleViewCustomer = async (customerId) => {

        try {

            setError("");

            const response = await api.get(
                `/customers/${customerId}`
            );

            setSelectedCustomer(
                response.data.customer
            );

            setShowDetails(true);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load customer details"
            );

        }
    };


    // followup form change

    const handleFollowupChange = (e) => {

        const { name, value } = e.target;

        setFollowupForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // add followup

    const handleFollowupSubmit = async (e) => {

        e.preventDefault();

        if (!selectedCustomer) {
            return;
        }

        try {

            setError("");
            setMessage("");

            await api.post(
                `/customers/${selectedCustomer.id}/followups`,
                followupForm
            );

            setMessage(
                "Follow-up added successfully"
            );

            setFollowupForm({
                note: "",
                followUpDate: ""
            });

            setShowFollowupForm(false);

            await handleViewCustomer(
                selectedCustomer.id
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to add follow-up"
            );

        }
    };


    // close customer details

    const closeDetails = () => {

        setShowDetails(false);
        setSelectedCustomer(null);
        setShowFollowupForm(false);

        setFollowupForm({
            note: "",
            followUpDate: ""
        });

    };


    if (loading) {

        return (
            <div className="customers-loading">
                <p>Loading customers...</p>
            </div>
        );

    }


    return (

        <div className="customers-page">

            {/* Header */}

            <div className="customers-header">

                <div>
                    <h1>Customers</h1>

                    <p>
                        Manage your customers and follow-ups
                    </p>
                </div>

                <button
                    className="add-customer-button"
                    onClick={openAddForm}
                >
                    + Add Customer
                </button>

            </div>


            {/* Messages */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Search */}

            <div className="customers-toolbar">

                <form
                    className="customer-search-form"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="customer-search-input"
                    />

                    <button
                        type="submit"
                        className="search-button"
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        className="clear-search-button"
                        onClick={() => {

                            setSearch("");

                            setTimeout(() => {
                                fetchCustomers();
                            }, 0);

                        }}
                    >
                        Clear
                    </button>

                </form>

            </div>


            {/* Customers Table */}

            <div className="customers-table-container">

                {customers.length === 0 ? (

                    <div className="empty-customers">
                        <p>No customers found.</p>
                    </div>

                ) : (

                    <table className="customers-table">

                        <thead>

                            <tr>

                                <th>Name</th>
                                <th>Business</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {customers.map((customer) => (

                                <tr key={customer.id}>

                                    <td>
                                        {customer.name}
                                    </td>

                                    <td>
                                        {customer.businessName || "-"}
                                    </td>

                                    <td>
                                        {customer.email || "-"}
                                    </td>

                                    <td>
                                        {customer.mobile || "-"}
                                    </td>

                                    <td>
                                        {customer.customerType || "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={`customer-status customer-status-${customer.status?.toLowerCase()}`}
                                        >
                                            {customer.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="customer-actions">

                                            <button
                                                className="view-customer-button"
                                                onClick={() =>
                                                    handleViewCustomer(
                                                        customer.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="edit-customer-button"
                                                onClick={() =>
                                                    openEditForm(
                                                        customer
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>


            {/* Add / Edit Customer */}

            {showForm && (

                <div className="customer-modal-overlay">

                    <div className="customer-modal">

                        <div className="customer-modal-header">

                            <h2>
                                {editingCustomer
                                    ? "Edit Customer"
                                    : "Add Customer"}
                            </h2>

                            <button
                                className="close-modal-button"
                                onClick={() => {

                                    setShowForm(false);
                                    setEditingCustomer(null);

                                }}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="customer-form"
                            onSubmit={handleCustomerSubmit}
                        >

                            <div className="form-group">

                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={customerForm.name}
                                    onChange={handleCustomerChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Mobile</label>

                                <input
                                    type="text"
                                    name="mobile"
                                    value={customerForm.mobile}
                                    onChange={handleCustomerChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={customerForm.email}
                                    onChange={handleCustomerChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>Business Name</label>

                                <input
                                    type="text"
                                    name="businessName"
                                    value={customerForm.businessName}
                                    onChange={handleCustomerChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>GST Number</label>

                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={customerForm.gstNumber}
                                    onChange={handleCustomerChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>Customer Type</label>

                                <select
                                    name="customerType"
                                    value={customerForm.customerType}
                                    onChange={handleCustomerChange}
                                >

                                    <option value="WHOLESALE">
                                        Wholesale
                                    </option>

                                    <option value="RETAIL">
                                        Retail
                                    </option>

                                    <option value="DISTRIBUTOR">
                                        Distributor
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>Address</label>

                                <textarea
                                    name="address"
                                    value={customerForm.address}
                                    onChange={handleCustomerChange}
                                    rows="3"
                                />

                            </div>


                            <div className="form-group">

                                <label>Status</label>

                                <select
                                    name="status"
                                    value={customerForm.status}
                                    onChange={handleCustomerChange}
                                >

                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="INACTIVE">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>Follow-up Date</label>

                                <input
                                    type="date"
                                    name="followUpDate"
                                    value={customerForm.followUpDate}
                                    onChange={handleCustomerChange}
                                />

                            </div>


                            <div className="customer-form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {

                                        setShowForm(false);
                                        setEditingCustomer(null);

                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-customer-button"
                                >
                                    {editingCustomer
                                        ? "Update Customer"
                                        : "Create Customer"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* Customer Details */}

            {showDetails && selectedCustomer && (

                <div className="customer-modal-overlay">

                    <div className="customer-details-modal">

                        <div className="customer-modal-header">

                            <h2>
                                Customer Details
                            </h2>

                            <button
                                className="close-modal-button"
                                onClick={closeDetails}
                            >
                                ×
                            </button>

                        </div>


                        {/* Customer Information */}

                        <div className="customer-details-section">

                            <h3>
                                Customer Information
                            </h3>

                            <div className="customer-details-grid">

                                <div className="customer-detail-item">

                                    <span>Name</span>

                                    <strong>
                                        {selectedCustomer.name}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Mobile</span>

                                    <strong>
                                        {selectedCustomer.mobile || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Email</span>

                                    <strong>
                                        {selectedCustomer.email || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Business</span>

                                    <strong>
                                        {selectedCustomer.businessName || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>GST Number</span>

                                    <strong>
                                        {selectedCustomer.gstNumber || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Customer Type</span>

                                    <strong>
                                        {selectedCustomer.customerType || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Status</span>

                                    <strong>
                                        {selectedCustomer.status || "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item">

                                    <span>Follow-up Date</span>

                                    <strong>
                                        {selectedCustomer.followUpDate
                                            ? new Date(
                                                selectedCustomer.followUpDate
                                            ).toLocaleDateString()
                                            : "-"}
                                    </strong>

                                </div>


                                <div className="customer-detail-item customer-detail-full">

                                    <span>Address</span>

                                    <strong>
                                        {selectedCustomer.address || "-"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* Follow-ups */}

                        <div className="customer-details-section">

                            <div className="followups-header">

                                <h3>
                                    Follow-ups
                                </h3>

                                <button
                                    className="add-followup-button"
                                    onClick={() =>
                                        setShowFollowupForm(
                                            !showFollowupForm
                                        )
                                    }
                                >
                                    + Add Follow-up
                                </button>

                            </div>


                            {/* Follow-up Form */}

                            {showFollowupForm && (

                                <form
                                    className="followup-form"
                                    onSubmit={handleFollowupSubmit}
                                >

                                    <div className="form-group">

                                        <label>Note</label>

                                        <textarea
                                            name="note"
                                            value={followupForm.note}
                                            onChange={handleFollowupChange}
                                            rows="3"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Follow-up Date
                                        </label>

                                        <input
                                            type="date"
                                            name="followUpDate"
                                            value={
                                                followupForm.followUpDate
                                            }
                                            onChange={
                                                handleFollowupChange
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="followup-form-actions">

                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() =>
                                                setShowFollowupForm(
                                                    false
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="save-followup-button"
                                        >
                                            Add Follow-up
                                        </button>

                                    </div>

                                </form>

                            )}


                            {/* Follow-up List */}

                            {selectedCustomer.followups &&
                            selectedCustomer.followups.length > 0 ? (

                                <div className="followups-list">

                                    {selectedCustomer.followups.map(
                                        (followup) => (

                                            <div
                                                className="followup-card"
                                                key={followup.id}
                                            >

                                                <div className="followup-note">
                                                    {followup.note}
                                                </div>

                                                <div className="followup-date">
                                                    {followup.followUpDate
                                                        ? new Date(
                                                            followup.followUpDate
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="empty-followups">

                                    <p>
                                        No follow-ups found.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Customers;