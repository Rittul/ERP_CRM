import { useEffect, useState } from "react";
import api from "../utils/api";
import "../css/Challans.css";

const Challans = () => {

    const [challans, setChallans] = useState([]);

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedChallan, setSelectedChallan] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingChallan, setEditingChallan] = useState(null);

    const [challanForm, setChallanForm] = useState({
        customerId: "",
        items: []
    });

    const [newItem, setNewItem] = useState({
        productId: "",
        quantity: ""
    });

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // get all challans

    const fetchChallans = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/challan?page=${page}&limit=${limit}`
            );

            setChallans(
                response.data.challans || []
            );

            setTotalPages(
                response.data.totalPages || 1
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load challans"
            );

        } finally {

            setLoading(false);

        }
    };


    // get customers

    const fetchCustomers = async () => {

        try {

            const response = await api.get(
                "/customers"
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

        }
    };


    // get products

    const fetchProducts = async () => {

        try {

            const response = await api.get(
                "/products"
            );

            setProducts(
                response.data.products || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        }
    };


    useEffect(() => {

        fetchChallans();

    }, [page]);


    useEffect(() => {

        fetchCustomers();
        fetchProducts();

    }, []);


    // reset challan form

    const resetForm = () => {

        setChallanForm({
            customerId: "",
            items: []
        });

        setNewItem({
            productId: "",
            quantity: ""
        });

    };


    // open create form

    const openCreateForm = () => {

        resetForm();

        setEditingChallan(null);
        setShowForm(true);

        setError("");
        setMessage("");

    };


    // customer change

    const handleCustomerChange = (e) => {

        setChallanForm((prev) => ({
            ...prev,
            customerId: e.target.value
        }));

    };


    // new item change

    const handleNewItemChange = (e) => {

        const { name, value } = e.target;

        setNewItem((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // add product to challan

    const handleAddItem = () => {

        if (!newItem.productId) {

            setError(
                "Please select a product"
            );

            return;

        }

        if (
            !newItem.quantity ||
            Number(newItem.quantity) <= 0
        ) {

            setError(
                "Quantity must be greater than 0"
            );

            return;

        }


        // prevent duplicate product

        const alreadyExists =
            challanForm.items.some(
                (item) =>
                    Number(item.productId) ===
                    Number(newItem.productId)
            );


        if (alreadyExists) {

            setError(
                "Same product cannot be added twice"
            );

            return;

        }


        setChallanForm((prev) => ({

            ...prev,

            items: [
                ...prev.items,
                {
                    productId: Number(
                        newItem.productId
                    ),
                    quantity: Number(
                        newItem.quantity
                    )
                }
            ]

        }));


        setNewItem({
            productId: "",
            quantity: ""
        });

        setError("");

    };


    // remove item

    const handleRemoveItem = (index) => {

        setChallanForm((prev) => ({

            ...prev,

            items: prev.items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )

        }));

    };


    // get product information

    const getProduct = (productId) => {

        return products.find(
            (product) =>
                Number(product.id) ===
                Number(productId)
        );

    };


    // calculate total quantity

    const getTotalQuantity = () => {

        return challanForm.items.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

    };


    // create or update challan

    const handleChallanSubmit = async (e) => {

        e.preventDefault();

        if (!challanForm.customerId) {

            setError(
                "Please select a customer"
            );

            return;

        }


        if (challanForm.items.length === 0) {

            setError(
                "Please add at least one product"
            );

            return;

        }


        try {

            setFormLoading(true);

            setError("");
            setMessage("");


            const data = {

                customerId:
                    Number(challanForm.customerId),

                items:
                    challanForm.items.map(
                        (item) => ({
                            productId:
                                Number(item.productId),

                            quantity:
                                Number(item.quantity)
                        })
                    )

            };


            if (editingChallan) {

                await api.put(
                    `/challan/${editingChallan.id}`,
                    data
                );

                setMessage(
                    "Challan updated successfully"
                );

            } else {

                await api.post(
                    "/challan",
                    data
                );

                setMessage(
                    "Challan created successfully"
                );

            }


            setShowForm(false);
            setEditingChallan(null);

            resetForm();

            await fetchChallans();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save challan"
            );

        } finally {

            setFormLoading(false);

        }

    };


    // edit draft challan

    const handleEdit = async (challanId) => {

        try {

            setError("");

            const response = await api.get(
                `/challan/${challanId}`
            );

            const challan =
                response.data.challan;


            if (challan.status !== "DRAFT") {

                setError(
                    "Only draft challans can be edited"
                );

                return;

            }


            setEditingChallan(challan);


            setChallanForm({

                customerId:
                    challan.customerId,

                items:
                    challan.items.map(
                        (item) => ({
                            productId:
                                item.productId,

                            quantity:
                                item.quantity
                        })
                    )

            });


            setShowForm(true);

            setMessage("");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load challan"
            );

        }

    };


    // view challan

    const handleView = async (challanId) => {

        try {

            setError("");

            const response = await api.get(
                `/challan/${challanId}`
            );

            setSelectedChallan(
                response.data.challan
            );

            setShowDetails(true);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load challan"
            );

        }

    };


    // confirm challan

    const handleConfirm = async (challanId) => {

        const confirmed = window.confirm(
            "Are you sure you want to confirm this challan? Stock will be reduced."
        );

        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setMessage("");

            await api.post(
                `/challan/${challanId}/confirm`
            );

            setMessage(
                "Challan confirmed successfully"
            );

            await fetchChallans();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to confirm challan"
            );

        }

    };


    // close form

    const closeForm = () => {

        setShowForm(false);
        setEditingChallan(null);

        resetForm();

    };


    // close details

    const closeDetails = () => {

        setShowDetails(false);
        setSelectedChallan(null);

    };


    // previous page

    const handlePreviousPage = () => {

        if (page > 1) {
            setPage(page - 1);
        }

    };


    // next page

    const handleNextPage = () => {

        if (page < totalPages) {
            setPage(page + 1);
        }

    };


    if (loading) {

        return (

            <div className="challans-loading">

                <p>
                    Loading challans...
                </p>

            </div>

        );

    }


    return (

        <div className="challans-page">


            {/* Header */}

            <div className="challans-header">

                <div>

                    <h1>
                        Challans
                    </h1>

                    <p>
                        Manage customer challans and stock dispatches
                    </p>

                </div>


                <button
                    className="add-challan-button"
                    onClick={openCreateForm}
                >
                    + Create Challan
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


            {/* Challan Table */}

            <div className="challans-table-container">

                {challans.length === 0 ? (

                    <div className="empty-challans">

                        <p>
                            No challans found.
                        </p>

                    </div>

                ) : (

                    <table className="challans-table">

                        <thead>

                            <tr>

                                <th>
                                    Challan Number
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Total Quantity
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created By
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {challans.map(
                                (challan) => (

                                    <tr
                                        key={
                                            challan.id
                                        }
                                    >

                                        <td>
                                            {
                                                challan.challanNumber
                                            }
                                        </td>


                                        <td>
                                            {
                                                challan.customer?.name ||
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                challan.totalQuantity
                                            }
                                        </td>


                                        <td>

                                            <span
                                                className={`challan-status challan-status-${challan.status?.toLowerCase()}`}
                                            >
                                                {
                                                    challan.status
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            {
                                                challan.createdBy?.name ||
                                                "-"
                                            }

                                        </td>


                                        <td>

                                            {challan.createdAt
                                                ? new Date(
                                                    challan.createdAt
                                                ).toLocaleDateString()
                                                : "-"}

                                        </td>


                                        <td>

                                            <div className="challan-actions">


                                                <button
                                                    className="view-challan-button"
                                                    onClick={() =>
                                                        handleView(
                                                            challan.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                {challan.status ===
                                                    "DRAFT" && (

                                                    <>

                                                        <button
                                                            className="edit-challan-button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    challan.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className="confirm-challan-button"
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    challan.id
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </button>

                                                    </>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* Pagination */}

            <div className="challan-pagination">

                <button
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>


                <span className="pagination-info">

                    Page {page} of {totalPages}

                </span>


                <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Next
                </button>

            </div>


            {/* Create / Edit Challan */}

            {showForm && (

                <div className="challan-modal-overlay">

                    <div className="challan-modal">


                        <div className="challan-modal-header">

                            <h2>

                                {editingChallan
                                    ? "Edit Challan"
                                    : "Create Challan"}

                            </h2>


                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={closeForm}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="challan-form"
                            onSubmit={
                                handleChallanSubmit
                            }
                        >


                            {/* Customer */}

                            <div className="form-group">

                                <label>
                                    Customer
                                </label>


                                <select
                                    value={
                                        challanForm.customerId
                                    }
                                    onChange={
                                        handleCustomerChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Customer
                                    </option>


                                    {customers.map(
                                        (customer) => (

                                            <option
                                                key={
                                                    customer.id
                                                }
                                                value={
                                                    customer.id
                                                }
                                            >
                                                {
                                                    customer.name
                                                }

                                                {customer.businessName
                                                    ? ` - ${customer.businessName}`
                                                    : ""}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Add Product */}

                            <div className="challan-add-item">

                                <h3>
                                    Add Product
                                </h3>


                                <div className="challan-item-inputs">


                                    <div className="form-group">

                                        <label>
                                            Product
                                        </label>


                                        <select
                                            name="productId"
                                            value={
                                                newItem.productId
                                            }
                                            onChange={
                                                handleNewItemChange
                                            }
                                        >

                                            <option value="">
                                                Select Product
                                            </option>


                                            {products.map(
                                                (product) => (

                                                    <option
                                                        key={
                                                            product.id
                                                        }
                                                        value={
                                                            product.id
                                                        }
                                                    >

                                                        {product.name}
                                                        {" - "}
                                                        {product.sku}

                                                        {" (Stock: "}
                                                        {
                                                            product.currentStock
                                                        }
                                                        {")"}

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Quantity
                                        </label>


                                        <input
                                            type="number"
                                            name="quantity"
                                            min="1"
                                            value={
                                                newItem.quantity
                                            }
                                            onChange={
                                                handleNewItemChange
                                            }
                                            placeholder="Quantity"
                                        />

                                    </div>


                                    <button
                                        type="button"
                                        className="add-item-button"
                                        onClick={
                                            handleAddItem
                                        }
                                    >
                                        Add Product
                                    </button>

                                </div>

                            </div>


                            {/* Added Products */}

                            <div className="challan-items-section">

                                <h3>
                                    Challan Items
                                </h3>


                                {challanForm.items.length ===
                                0 ? (

                                    <p className="empty-challan-items">
                                        No products added yet.
                                    </p>

                                ) : (

                                    <table className="challan-items-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Product
                                                </th>

                                                <th>
                                                    SKU
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {challanForm.items.map(
                                                (
                                                    item,
                                                    index
                                                ) => {

                                                    const product =
                                                        getProduct(
                                                            item.productId
                                                        );

                                                    return (

                                                        <tr
                                                            key={
                                                                item.productId
                                                            }
                                                        >

                                                            <td>

                                                                {
                                                                    product?.name ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    product?.sku ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    item.quantity
                                                                }

                                                            </td>


                                                            <td>

                                                                <button
                                                                    type="button"
                                                                    className="remove-item-button"
                                                                    onClick={() =>
                                                                        handleRemoveItem(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    Remove
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>


                            {/* Total */}

                            <div className="challan-total">

                                <span>
                                    Total Quantity
                                </span>

                                <strong>
                                    {
                                        getTotalQuantity()
                                    }
                                </strong>

                            </div>


                            {/* Form Actions */}

                            <div className="challan-form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-challan-button"
                                    disabled={
                                        formLoading
                                    }
                                >

                                    {formLoading
                                        ? "Saving..."
                                        : editingChallan
                                            ? "Update Draft"
                                            : "Save Draft"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* Challan Details */}

            {showDetails &&
                selectedChallan && (

                    <div className="challan-modal-overlay">

                        <div className="challan-details-modal">


                            <div className="challan-modal-header">

                                <h2>
                                    Challan Details
                                </h2>


                                <button
                                    type="button"
                                    className="close-modal-button"
                                    onClick={
                                        closeDetails
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* Challan Information */}

                            <div className="challan-details-section">

                                <div className="challan-detail-item">

                                    <span>
                                        Challan Number
                                    </span>

                                    <strong>
                                        {
                                            selectedChallan.challanNumber
                                        }
                                    </strong>

                                </div>


                                <div className="challan-detail-item">

                                    <span>
                                        Customer
                                    </span>

                                    <strong>
                                        {
                                            selectedChallan.customer?.name ||
                                            selectedChallan.customerName ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="challan-detail-item">

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {
                                            selectedChallan.status
                                        }
                                    </strong>

                                </div>


                                <div className="challan-detail-item">

                                    <span>
                                        Total Quantity
                                    </span>

                                    <strong>
                                        {
                                            selectedChallan.totalQuantity
                                        }
                                    </strong>

                                </div>


                                <div className="challan-detail-item">

                                    <span>
                                        Created By
                                    </span>

                                    <strong>
                                        {
                                            selectedChallan.createdBy?.name ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="challan-detail-item">

                                    <span>
                                        Created At
                                    </span>

                                    <strong>

                                        {selectedChallan.createdAt
                                            ? new Date(
                                                selectedChallan.createdAt
                                            ).toLocaleString()
                                            : "-"}

                                    </strong>

                                </div>

                            </div>


                            {/* Customer Snapshot */}

                            {selectedChallan.status ===
                                "CONFIRMED" && (

                                <div className="challan-details-section">

                                    <h3>
                                        Customer Information
                                    </h3>


                                    <div className="customer-snapshot">

                                        <p>
                                            <strong>
                                                Name:
                                            </strong>{" "}
                                            {
                                                selectedChallan.customerName ||
                                                selectedChallan.customer?.name ||
                                                "-"
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Mobile:
                                            </strong>{" "}
                                            {
                                                selectedChallan.customerMobile ||
                                                selectedChallan.customer?.mobile ||
                                                "-"
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Email:
                                            </strong>{" "}
                                            {
                                                selectedChallan.customerEmail ||
                                                selectedChallan.customer?.email ||
                                                "-"
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Business:
                                            </strong>{" "}
                                            {
                                                selectedChallan.businessName ||
                                                selectedChallan.customer?.businessName ||
                                                "-"
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                GST:
                                            </strong>{" "}
                                            {
                                                selectedChallan.gstNumber ||
                                                selectedChallan.customer?.gstNumber ||
                                                "-"
                                            }
                                        </p>


                                        <p>
                                            <strong>
                                                Address:
                                            </strong>{" "}
                                            {
                                                selectedChallan.customerAddress ||
                                                selectedChallan.customer?.address ||
                                                "-"
                                            }
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* Challan Items */}

                            <div className="challan-details-section">

                                <h3>
                                    Products
                                </h3>


                                {selectedChallan.items &&
                                selectedChallan.items.length > 0 ? (

                                    <table className="challan-items-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Product
                                                </th>

                                                <th>
                                                    SKU
                                                </th>

                                                <th>
                                                    Unit Price
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {selectedChallan.items.map(
                                                (item) => (

                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                item.productName
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.sku
                                                            }
                                                        </td>

                                                        <td>
                                                            ₹
                                                            {
                                                                item.unitPrice
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.quantity
                                                            }
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                ) : (

                                    <p>
                                        No items found.
                                    </p>

                                )}

                            </div>


                            {/* Confirm from details */}

                            {selectedChallan.status ===
                                "DRAFT" && (

                                <div className="challan-details-actions">

                                    <button
                                        className="confirm-challan-button"
                                        onClick={async () => {

                                            await handleConfirm(
                                                selectedChallan.id
                                            );

                                            closeDetails();

                                        }}
                                    >
                                        Confirm Challan
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                )}

        </div>
    );
};

export default Challans;