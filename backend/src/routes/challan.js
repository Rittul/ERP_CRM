const express = require("express");
const challanRouter = express.Router();

const prisma = require("../config/prisma");
const userauth = require("../middleware/auth");
const roleauth = require("../middleware/roleauth");

// create challan
challanRouter.post("/",userauth,roleauth("ADMIN", "SALES"),
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


// confirm the draft challan
challanRouter.post("/:id/confirm",userauth,roleauth("ADMIN", "SALES"),
    async (req, res) => {
        try {
            const challanId = Number(req.params.id);

            if (Number.isNaN(challanId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid challan ID"
                });
            }

            const challan = await prisma.challan.findUnique({
                where: {
                    id: challanId
                },
                include: {
                    customer: true,
                    items: true
                }
            });

            if (!challan) {
                return res.status(404).json({
                    success: false,
                    message: "Challan not found"
                });
            }

            if (challan.status !== "DRAFT") {
                return res.status(400).json({
                    success: false,
                    message: "Only draft challans can be confirmed"
                });
            }

            // Get current products
            const productIds = challan.items.map(
                item => item.productId
            );

            const products = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIds
                    }
                }
            });

            // Check stock
            for (const item of challan.items) {

                const product = products.find(
                    p => p.id === item.productId
                );

                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message:
                            `Product ${item.productId} not found`
                    });
                }

                if (product.currentStock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message:
                            `Insufficient stock for ${product.name}`
                    });
                }
            }

            // Transaction
            const confirmedChallan =
                await prisma.$transaction(async (tx) => {

                    // -------------------------
                    // 1. Customer snapshot
                    // -------------------------

                    await tx.challan.update({
                        where: {
                            id: challanId
                        },
                        data: {
                            customerName: challan.customer.name,
                            customerMobile: challan.customer.mobile,
                            customerEmail: challan.customer.email,
                            customerAddress: challan.customer.address,
                            businessName: challan.customer.businessName,
                            gstNumber: challan.customer.gstNumber
                        }
                    });

                    // -------------------------
                    // 2. Reduce stock
                    // -------------------------

                    for (const item of challan.items) {

                        await tx.product.update({
                            where: {
                                id: item.productId
                            },
                            data: {
                                currentStock: {
                                    decrement: item.quantity
                                }
                            }
                        });

                        // -------------------------
                        // 3. Stock movement
                        // -------------------------

                        await tx.stockMovement.create({
                            data: {
                                productId: item.productId,
                                movementType: "OUT",
                                quantity: item.quantity,
                                reason:
                                    `Challan ${challan.challanNumber}`,
                                createdById: req.user.id
                            }
                        });
                    }

                    // -------------------------
                    // 4. Confirm challan
                    // -------------------------

                    return await tx.challan.update({
                        where: {
                            id: challanId
                        },
                        data: {
                            status: "CONFIRMED"
                        },

                        include: {
                            customer: true,
                            createdBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    role: true
                                }
                            },
                            items: true
                        }
                    });
                });

            return res.status(200).json({
                success: true,
                message: "Challan confirmed successfully",
                challan: confirmedChallan
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


// UPDATE DRAFT CHALLAN

challanRouter.put("/:id",userauth,roleauth("ADMIN", "SALES"),
    async (req, res) => {
        try {

            const challanId = Number(req.params.id);
            // Validate challan ID

            if (Number.isNaN(challanId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid challan ID"
                });
            }

            const { customerId, items } = req.body;

            // -------------------------
            // Validate customer ID
            // -------------------------

            const parsedCustomerId = Number(customerId);

            if (Number.isNaN(parsedCustomerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            // -------------------------
            // Validate items
            // -------------------------

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one product is required"
                });
            }

            // -------------------------
            // Find existing challan
            // -------------------------

            const existingChallan = await prisma.challan.findUnique({
                where: {
                    id: challanId
                }
            });

            if (!existingChallan) {
                return res.status(404).json({
                    success: false,
                    message: "Challan not found"
                });
            }

            // -------------------------
            // Only DRAFT can be edited
            // -------------------------

            if (existingChallan.status !== "DRAFT") {
                return res.status(400).json({
                    success: false,
                    message: "Only draft challans can be edited"
                });
            }

            // -------------------------
            // Check customer exists
            // -------------------------

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

            // -------------------------
            // Validate each item
            // -------------------------

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

            // -------------------------
            // Prevent duplicate products
            // in the SAME challan
            // -------------------------

            const productIds = items.map(
                item => Number(item.productId)
            );

            if (
                new Set(productIds).size !==
                productIds.length
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Same product cannot be added twice in one challan"
                });
            }

            // -------------------------
            // Find products
            // -------------------------

            const products = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIds
                    }
                }
            });

            // Make sure every product exists
            if (products.length !== productIds.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more products not found"
                });
            }

            // -------------------------
            // Calculate total quantity
            // -------------------------

            const totalQuantity = items.reduce(
                (total, item) => {
                    return total + Number(item.quantity);
                },
                0
            );

            // -------------------------
            // Update challan
            // -------------------------

            const updatedChallan = await prisma.$transaction(
                async (tx) => {

                    // Delete old items
                    await tx.challanItem.deleteMany({
                        where: {
                            challanId
                        }
                    });

                    // Update challan and create
                    // new items
                    const challan = await tx.challan.update({
                        where: {
                            id: challanId
                        },

                        data: {
                            customerId: parsedCustomerId,
                            totalQuantity,

                            items: {
                                create: items.map(item => {

                                    const product = products.find(
                                        p =>
                                            p.id ===
                                            Number(item.productId)
                                    );

                                    return {
                                        productId: product.id,

                                        // Product snapshot
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

                    return challan;
                }
            );

            return res.status(200).json({
                success: true,
                message: "Challan updated successfully",
                challan: updatedChallan
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

// get all chalans
challanRouter.get(
    "/",
    userauth,
    async (req, res) => {
        try {

            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 10;

            if (page < 1) {
                page = 1;
            }

            if (limit < 1) {
                limit = 10;
            }

            if (limit > 100) {
                limit = 100;
            }

            const skip = (page - 1) * limit;

            const [challans, total] = await prisma.$transaction([
                prisma.challan.findMany({
                    skip,
                    take: limit,

                    include: {
                        customer: true,

                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },

                        items: true
                    },

                    orderBy: {
                        createdAt: "desc"
                    }
                }),

                prisma.challan.count()
            ]);

            const totalPages = Math.ceil(total / limit);

            return res.status(200).json({
                success: true,
                page,
                limit,
                total,
                totalPages,
                challans
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

// get challan by id
challanRouter.get(
    "/:id",
    userauth,
    async (req, res) => {
        try {

            const challanId = Number(req.params.id);

            if (Number.isNaN(challanId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid challan ID"
                });
            }

            const challan = await prisma.challan.findUnique({
                where: {
                    id: challanId
                },

                include: {
                    customer: true,

                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    },

                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            if (!challan) {
                return res.status(404).json({
                    success: false,
                    message: "Challan not found"
                });
            }

            return res.status(200).json({
                success: true,
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

module.exports =challanRouter;