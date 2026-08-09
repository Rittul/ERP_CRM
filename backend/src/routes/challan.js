const express = require("express");
const challanRouter = express.Router();

const prisma = require("../config/prisma");
const userauth = require("../middleware/auth");
const roleauth = require("../middleware/roleauth");
challanRouter.post(
    "/",
    userauth,
    roleauth("ADMIN", "SALES"),
    async (req, res) => {
        try {
            const { customerId, items } = req.body;

            const parsedCustomerId = Number(customerId);

            if (Number.isNaN(parsedCustomerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one product is required"
                });
            }

            const customer = await prisma.customer.findUnique({
                where: {
                    id: parsedCustomerId
                }
            });

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            // Validate items
            for (const item of items) {
                const productId = Number(item.productId);
                const quantity = Number(item.quantity);

                if (Number.isNaN(productId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid product ID"
                    });
                }

                if (
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Quantity must be a positive integer"
                    });
                }
            }

            const productIds = items.map(
                item => Number(item.productId)
            );

            // Prevent duplicate products in same challan
            if (new Set(productIds).size !== productIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "Same product cannot be added twice"
                });
            }

            const products = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIds
                    }
                }
            });

            if (products.length !== productIds.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more products not found"
                });
            }

            const totalQuantity = items.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );

            const challanNumber =
                `CH-${Date.now()}`;

            const challan = await prisma.challan.create({
                data: {
                    challanNumber,
                    customerId: parsedCustomerId,
                    totalQuantity,
                    status: "DRAFT",
                    createdById: req.user.id,

                    items: {
                        create: items.map(item => {
                            const product = products.find(
                                p =>
                                    p.id ===
                                    Number(item.productId)
                            );

                            return {
                                productId: product.id,
                                productName: product.name,
                                sku: product.sku,
                                unitPrice: product.unitPrice,
                                quantity: Number(item.quantity)
                            };
                        })
                    }
                },

                include: {
                    customer: true,
                    items: true
                }
            });

            return res.status(201).json({
                success: true,
                message: "Challan created successfully",
                challan
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

