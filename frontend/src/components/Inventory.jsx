import { useEffect, useState } from "react";
import api from "../utils/api";
import "../css/Inventory.css";

const Inventory = () => {

    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");

    const [product, setProduct] = useState(null);
    const [movements, setMovements] = useState([]);

    const [movementForm, setMovementForm] = useState({
        movementType: "IN",
        quantity: "",
        reason: ""
    });

    const [loading, setLoading] = useState(true);
    const [movementLoading, setMovementLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // get all products

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(
                response.data.products || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProducts();

    }, []);


    // get inventory of selected product

    const fetchInventory = async (productId) => {

        if (!productId) {
            setProduct(null);
            setMovements([]);
            return;
        }

        try {

            setError("");

            const response = await api.get(
                `/inventory/${productId}`
            );

            setProduct(
                response.data.product
            );

            setMovements(
                response.data.movements || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load inventory"
            );

        }
    };


    // product selection

    const handleProductChange = (e) => {

        const productId = e.target.value;

        setSelectedProductId(productId);

        setMessage("");

        fetchInventory(productId);

    };


    // movement form change

    const handleMovementChange = (e) => {

        const { name, value } = e.target;

        setMovementForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // create stock movement

    const handleMovementSubmit = async (e) => {

        e.preventDefault();

        if (!selectedProductId) {

            setError(
                "Please select a product first"
            );

            return;
        }

        try {

            setMovementLoading(true);

            setError("");
            setMessage("");

            const data = {
                movementType:
                    movementForm.movementType,

                quantity:
                    Number(movementForm.quantity),

                reason:
                    movementForm.reason
            };


            const response = await api.post(
                `/inventory/${selectedProductId}`,
                data
            );


            setMessage(
                response.data.message ||
                "Stock movement successful"
            );


            setMovementForm({
                movementType: "IN",
                quantity: "",
                reason: ""
            });


            // refresh selected product inventory

            await fetchInventory(
                selectedProductId
            );


            // refresh products list
            // so current stock is also updated

            await fetchProducts();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update stock"
            );

        } finally {

            setMovementLoading(false);

        }
    };


    if (loading) {

        return (

            <div className="inventory-loading">

                <p>
                    Loading inventory...
                </p>

            </div>

        );

    }


    return (

        <div className="inventory-page">


            {/* Header */}

            <div className="inventory-header">

                <div>

                    <h1>
                        Inventory
                    </h1>

                    <p>
                        Manage stock movements and inventory
                    </p>

                </div>

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


            {/* Product Selection */}

            <div className="inventory-product-selection">

                <label>
                    Select Product
                </label>

                <select
                    value={selectedProductId}
                    onChange={handleProductChange}
                    className="product-select"
                >

                    <option value="">
                        Select a product
                    </option>

                    {products.map((product) => (

                        <option
                            key={product.id}
                            value={product.id}
                        >
                            {product.name} - {product.sku}
                        </option>

                    ))}

                </select>

            </div>


            {/* Selected Product */}

            {product && (

                <div className="inventory-product-section">


                    {/* Product Information */}

                    <div className="inventory-product-card">

                        <div className="product-info">

                            <h2>
                                {product.name}
                            </h2>

                            <p>
                                SKU: {product.sku}
                            </p>

                        </div>


                        <div className="stock-info">

                            <div className="stock-item">

                                <span>
                                    Current Stock
                                </span>

                                <strong>
                                    {product.currentStock}
                                </strong>

                            </div>


                            <div className="stock-item">

                                <span>
                                    Minimum Stock
                                </span>

                                <strong>
                                    {product.minimumStock}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Stock Movement Form */}

                    <div className="inventory-movement-section">

                        <div className="section-header">

                            <h2>
                                Stock Movement
                            </h2>

                        </div>


                        <form
                            className="inventory-movement-form"
                            onSubmit={
                                handleMovementSubmit
                            }
                        >


                            {/* Movement Type */}

                            <div className="form-group">

                                <label>
                                    Movement Type
                                </label>

                                <select
                                    name="movementType"
                                    value={
                                        movementForm.movementType
                                    }
                                    onChange={
                                        handleMovementChange
                                    }
                                >

                                    <option value="IN">
                                        IN
                                    </option>

                                    <option value="OUT">
                                        OUT
                                    </option>

                                </select>

                            </div>


                            {/* Quantity */}

                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={
                                        movementForm.quantity
                                    }
                                    onChange={
                                        handleMovementChange
                                    }
                                    placeholder="Enter quantity"
                                    required
                                />

                            </div>


                            {/* Reason */}

                            <div className="form-group">

                                <label>
                                    Reason
                                </label>

                                <input
                                    type="text"
                                    name="reason"
                                    value={
                                        movementForm.reason
                                    }
                                    onChange={
                                        handleMovementChange
                                    }
                                    placeholder="Enter reason"
                                    maxLength="255"
                                    required
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                className="stock-movement-button"
                                disabled={movementLoading}
                            >

                                {movementLoading
                                    ? "Updating..."
                                    : "Update Stock"}

                            </button>

                        </form>

                    </div>


                    {/* Movement History */}

                    <div className="inventory-history-section">

                        <div className="section-header">

                            <h2>
                                Movement History
                            </h2>

                        </div>


                        {movements.length === 0 ? (

                            <div className="empty-movements">

                                <p>
                                    No stock movements found.
                                </p>

                            </div>

                        ) : (

                            <div className="inventory-table-container">

                                <table className="inventory-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Reason
                                            </th>

                                            <th>
                                                Created By
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {movements.map(
                                            (movement) => (

                                                <tr
                                                    key={
                                                        movement.id
                                                    }
                                                >

                                                    <td>

                                                        <span
                                                            className={
                                                                movement.movementType ===
                                                                "IN"
                                                                    ? "movement-in"
                                                                    : "movement-out"
                                                            }
                                                        >
                                                            {
                                                                movement.movementType
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>
                                                        {
                                                            movement.quantity
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            movement.reason
                                                        }
                                                    </td>


                                                    <td>

                                                        {movement.createdBy?.name ||
                                                            "-"}

                                                    </td>


                                                    <td>

                                                        {movement.createdAt
                                                            ? new Date(
                                                                movement.createdAt
                                                            ).toLocaleString()
                                                            : "-"}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};

export default Inventory;