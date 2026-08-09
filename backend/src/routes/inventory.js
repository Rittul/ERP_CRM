const express = require("express");
const inventoryRouter = express.Router();

const prisma = require("../config/prisma");
const userauth = require("../middleware/auth");
const roleauth = require("../middleware/roleauth");

inventoryRouter.post("/:productId",userauth,roleauth("ADMIN", "WAREHOUSE"),
    async (req, res) => {
        try {
            const productId = Number(req.params.productId);

            if (Number.isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const {
                movementType,
                quantity,
                reason
            } = req.body;

            // -------------------------
            // Validate movement type
            // -------------------------

            if (!movementType) {
                return res.status(400).json({
                    success: false,
                    message: "Movement type is required"
                });
            }

            if (
                movementType !== "IN" &&
                movementType !== "OUT"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Movement type must be IN or OUT"
                });
            }

            // -------------------------
            // Validate quantity
            // -------------------------

            const parsedQuantity = Number(quantity);

            if (
                !quantity ||
                Number.isNaN(parsedQuantity) ||
                parsedQuantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be greater than 0"
                });
            }

            // -------------------------
            // Validate reason
            // -------------------------

            if (
                !reason ||
                typeof reason !== "string" ||
                reason.trim().length < 3
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Valid reason is required"
                });
            }

            if (reason.trim().length > 255) {
                return res.status(400).json({
                    success: false,
                    message: "Reason cannot exceed 255 characters"
                });
            }

            // -------------------------
            // Find product
            // -------------------------

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            // -------------------------
            // Check OUT stock
            // -------------------------

            if (
                movementType === "OUT" &&
                product.currentStock < parsedQuantity
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                });
            }

            // -------------------------
            // Calculate new stock
            // -------------------------

            let newStock;

            if (movementType === "IN") {
                newStock = product.currentStock + parsedQuantity;
            } else {
                newStock = product.currentStock - parsedQuantity;
            }

            // -------------------------
            // Transaction
            // -------------------------

            const result = await prisma.$transaction(async (tx) => {

                const updatedProduct = await tx.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        currentStock: newStock
                    }
                });

                const movement = await tx.stockMovement.create({
                    data: {
                        productId,
                        movementType,
                        quantity: parsedQuantity,
                        reason: reason.trim(),
                        createdById: req.user.id
                    }
                });

                return {
                    updatedProduct,
                    movement
                };
            });

            return res.status(201).json({
                success: true,
                message: `Stock ${movementType} successful`,
                currentStock: result.updatedProduct.currentStock,
                movement: result.movement
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

inventoryRouter.get("/:productId",userauth,
    async (req, res) => {
        try {

            const productId = Number(req.params.productId);

            if (Number.isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            const movements = await prisma.stockMovement.findMany({
                where: {
                    productId
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            return res.status(200).json({
                success: true,
                product: {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    currentStock: product.currentStock,
                    minimumStock: product.minimumStock
                },
                count: movements.length,
                movements
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

module.exports = inventoryRouter;