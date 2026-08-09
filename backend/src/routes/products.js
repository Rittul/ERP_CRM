const express = require("express");
const ProductRouter = express.Router();

const prisma = require("../config/prisma");
const userauth = require("../middleware/auth");
const roleauth = require("../middleware/roleauth");

// create product
ProductRouter.post("/",userauth,roleauth("ADMIN", "WAREHOUSE"),
    async (req, res) => {
        try {

            const {
                name,
                sku,
                categoryId,
                unitPrice,
                minimumStock,
                warehouseId
            } = req.body;

            // Required fields
            if (
                !name ||
                !sku ||
                categoryId === undefined ||
                unitPrice === undefined ||
                minimumStock === undefined ||
                warehouseId === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Required fields are missing"
                });
            }

            // Validate price
            if (Number(unitPrice) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Unit price cannot be negative"
                });
            }

            // Validate minimum stock
            if (Number(minimumStock) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum stock cannot be negative"
                });
            }

            // Check SKU
            const existingProduct = await prisma.product.findUnique({
                where: {
                    sku
                }
            });

            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message: "Product with this SKU already exists"
                });
            }

            // Check category
            const category = await prisma.category.findUnique({
                where: {
                    id: Number(categoryId)
                }
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            // Check warehouse
            const warehouse = await prisma.warehouse.findUnique({
                where: {
                    id: Number(warehouseId)
                }
            });

            if (!warehouse) {
                return res.status(404).json({
                    success: false,
                    message: "Warehouse not found"
                });
            }

            // Create product
            const product = await prisma.product.create({
                data: {
                    name,
                    sku,
                    categoryId: Number(categoryId),
                    unitPrice,
                    currentStock: 0,
                    minimumStock: Number(minimumStock),
                    warehouseId: Number(warehouseId)
                }
            });

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// get product
ProductRouter.get("/", userauth, async (req, res) => {
    try {

        const { search, lowStock } = req.query;

        // Get products
        const products = await prisma.product.findMany({
            where: search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            sku: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    ]
                }
                : {},

            include: {
                category: true,
                warehouse: true
            },

            orderBy: {
                createdAt: "desc"
            }
        });

        // Low stock filter
        let filteredProducts = products;

        if (lowStock === "true") {
            filteredProducts = products.filter(
                product =>
                    product.currentStock <=
                    product.minimumStock
            );
        }

        return res.status(200).json({
            success: true,
            count: filteredProducts.length,
            products: filteredProducts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// get product by id
ProductRouter.get("/:id",userauth,
    async (req, res) => {
        try {

            const productId = Number(req.params.id);

            if (Number.isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                },
                include: {
                    category: true,
                    warehouse: true,
                    stockMovements: {
                        orderBy: {
                            createdAt: "desc"
                        }
                    }
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                product
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

// update product
ProductRouter.put("/:id",userauth,roleauth("ADMIN", "WAREHOUSE"),
    async (req, res) => {
        try {

            const productId = Number(req.params.id);

            if (Number.isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const existingProduct = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const {
                name,
                sku,
                categoryId,
                unitPrice,
                minimumStock,
                warehouseId
            } = req.body;

            if (
                !name ||
                !sku ||
                categoryId === undefined ||
                unitPrice === undefined ||
                minimumStock === undefined ||
                warehouseId === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Required fields are missing"
                });
            }

            if (Number(unitPrice) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Unit price cannot be negative"
                });
            }

            if (Number(minimumStock) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum stock cannot be negative"
                });
            }

            // Check whether SKU belongs to another product
            const skuExists = await prisma.product.findFirst({
                where: {
                    sku,
                    NOT: {
                        id: productId
                    }
                }
            });

            if (skuExists) {
                return res.status(409).json({
                    success: false,
                    message: "Another product already uses this SKU"
                });
            }

            const category = await prisma.category.findUnique({
                where: {
                    id: Number(categoryId)
                }
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            const warehouse = await prisma.warehouse.findUnique({
                where: {
                    id: Number(warehouseId)
                }
            });

            if (!warehouse) {
                return res.status(404).json({
                    success: false,
                    message: "Warehouse not found"
                });
            }

            const product = await prisma.product.update({
                where: {
                    id: productId
                },
                data: {
                    name,
                    sku,
                    categoryId: Number(categoryId),
                    unitPrice,
                    minimumStock: Number(minimumStock),
                    warehouseId: Number(warehouseId)
                }
            });

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                product
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);


module.exports = ProductRouter;