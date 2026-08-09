import { useEffect, useState } from "react";
import api from "../utils/api";
import "../css/Product.css";

const Products = () => {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [lowStock, setLowStock] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [stockMessage, setStockMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [productForm, setProductForm] = useState({
        name: "",
        sku: "",
        categoryId: "",
        unitPrice: "",
        currentStock: "",
        minimumStock: "",
        warehouseId: ""
    });


    // get products

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            let url = "/products";

            const params = [];

            if (search.trim() !== "") {
                params.push(
                    `search=${encodeURIComponent(search)}`
                );
            }

            if (lowStock) {
                params.push("lowStock=true");
            }

            if (params.length > 0) {
                url = `${url}?${params.join("&")}`;
            }

            const response = await api.get(url);

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
    }, [lowStock]);


    // search

    const handleSearch = async (e) => {

        e.preventDefault();

        fetchProducts();

    };


    // product form change

    const handleProductChange = (e) => {

        const { name, value } = e.target;

        if (name === "currentStock") {
            setStockMessage("You can't change current stock here. Use stock movement instead.");
            return;
        }

        setStockMessage("");

        setProductForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // reset form

    const resetProductForm = () => {

        setProductForm({
            name: "",
            sku: "",
            categoryId: "",
            unitPrice: "",
            currentStock: "",
            minimumStock: "",
            warehouseId: ""
        });

    };


    // add product

    const openAddForm = () => {

        resetProductForm();

        setEditingProduct(null);
        setShowForm(true);

        setError("");
        setMessage("");

    };


    // edit product

    const openEditForm = (product) => {

        setProductForm({
            name: product.name || "",
            sku: product.sku || "",
            categoryId: product.categoryId || "",
            unitPrice: product.unitPrice || "",
            currentStock: product.currentStock ?? "",
            minimumStock: product.minimumStock ?? "",
            warehouseId: product.warehouseId || ""
        });

        setEditingProduct(product);
        setShowForm(true);

        setError("");
        setMessage("");

    };


    // create or update product

    const handleProductSubmit = async (e) => {

        e.preventDefault();

        try {

            setError("");
            setMessage("");

            const data = {
                name: productForm.name,
                sku: productForm.sku,
                categoryId: Number(productForm.categoryId),
                unitPrice: Number(productForm.unitPrice),
                currentStock: Number(productForm.currentStock),
                minimumStock: Number(productForm.minimumStock),
                warehouseId: Number(productForm.warehouseId)
            };


            if (editingProduct) {

                await api.put(
                    `/products/${editingProduct.id}`,
                    data
                );

                setMessage(
                    "Product updated successfully"
                );

            } else {

                await api.post(
                    "/products",
                    data
                );

                setMessage(
                    "Product created successfully"
                );

            }

            setShowForm(false);
            setEditingProduct(null);

            resetProductForm();

            fetchProducts();

        } catch (error) {

            console.error(error);

            const status = error.response?.status;
            const msg    = error.response?.data?.message;

            if (status === 403) {
                setError(msg || "Access Denied: You do not have permission to perform this action.");
            } else {
                setError(msg || "Failed to save product");
            }

        }

    };

    // clear filters

    const clearFilters = () => {

        setSearch("");
        setLowStock(false);

        setTimeout(() => {
            fetchProducts();
        }, 0);

    };


    if (loading) {

        return (
            <div className="products-loading">

                <p>
                    Loading products...
                </p>

            </div>
        );

    }


    return (

        <div className="products-page">


            {/* Header */}

            <div className="products-header">

                <div>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage products and stock
                    </p>

                </div>

                <button
                    className="add-product-button"
                    onClick={openAddForm}
                >
                    + Add Product
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


            {/* Search and Filter */}

            <div className="products-toolbar">

                <form
                    className="product-search-form"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search product or SKU..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="product-search-input"
                    />

                    <button
                        type="submit"
                        className="search-button"
                    >
                        Search
                    </button>

                </form>


                <label className="low-stock-filter">

                    <input
                        type="checkbox"
                        checked={lowStock}
                        onChange={(e) =>
                            setLowStock(e.target.checked)
                        }
                    />

                    Low Stock Only

                </label>


                <button
                    type="button"
                    className="clear-filter-button"
                    onClick={clearFilters}
                >
                    Clear
                </button>

            </div>


            {/* Products Table */}

            <div className="products-table-container">

                {products.length === 0 ? (

                    <div className="empty-products">

                        <p>
                            No products found.
                        </p>

                    </div>

                ) : (

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    SKU
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Unit Price
                                </th>

                                <th>
                                    Current Stock
                                </th>

                                <th>
                                    Minimum Stock
                                </th>

                                <th>
                                    Warehouse
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td>
                                        {product.name}
                                    </td>

                                    <td>
                                        {product.sku}
                                    </td>

                                    <td>
                                        {product.category?.name ||
                                            "-"}
                                    </td>

                                    <td>
                                        ₹{product.unitPrice}
                                    </td>

                                    <td
                                        className={
                                            product.currentStock <=
                                            product.minimumStock
                                                ? "low-stock-value"
                                                : ""
                                        }
                                    >
                                        {product.currentStock}
                                    </td>

                                    <td>
                                        {product.minimumStock}
                                    </td>

                                    <td>
                                        {product.warehouse?.name ||
                                            "-"}
                                    </td>

                                    <td>

                                        <div className="product-actions">

                                            <button
                                                className="edit-product-button"
                                                onClick={() =>
                                                    openEditForm(
                                                        product
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


            {/* Add / Edit Product */}

            {showForm && (

                <div className="product-modal-overlay">

                    <div className="product-modal">

                        <div className="product-modal-header">

                            <h2>

                                {editingProduct
                                    ? "Edit Product"
                                    : "Add Product"}

                            </h2>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={() => {

                                    setShowForm(false);
                                    setEditingProduct(null);

                                }}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="product-form"
                            onSubmit={handleProductSubmit}
                        >


                            <div className="form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={productForm.name}
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    SKU
                                </label>

                                <input
                                    type="text"
                                    name="sku"
                                    value={productForm.sku}
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category ID
                                </label>

                                <input
                                    type="number"
                                    name="categoryId"
                                    value={
                                        productForm.categoryId
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Unit Price
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="unitPrice"
                                    value={
                                        productForm.unitPrice
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Current Stock
                                </label>

                                <input
                                    type="number"
                                    name="currentStock"
                                    value={productForm.currentStock}
                                    readOnly
                                    onFocus={() => setStockMessage("You can't change current stock here. Use stock movement instead.")}
                                />
                                {stockMessage && (
                                    <p style={{ color: "#b91c1c", marginTop: "6px", fontSize: "13px" }}>
                                        {stockMessage}
                                    </p>
                                )}

                            </div>


                            <div className="form-group">

                                <label>
                                    Minimum Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="minimumStock"
                                    value={
                                        productForm.minimumStock
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Warehouse ID
                                </label>

                                <input
                                    type="number"
                                    name="warehouseId"
                                    value={
                                        productForm.warehouseId
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    required
                                />

                            </div>


                            <div className="product-form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {

                                        setShowForm(false);
                                        setEditingProduct(null);

                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-product-button"
                                >
                                    {editingProduct
                                        ? "Update Product"
                                        : "Create Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Products;