const express = require("express");
const customerRouter = express.Router();

const prisma = require("../config/prisma");
const userauth = require("../middleware/auth");
const roleauth = require("../middleware/roleauth");
const validator=require("validator")

// create customesr
customerRouter.post( "/",userauth,roleauth("ADMIN", "SALES"),
    async (req, res) => {

        try {
            const {
                name,
                mobile,
                email,
                businessName,
                gstNumber,
                customerType,
                address,
                status,
                followUpDate
            } = req.body;
            if(!validator.isEmail(email)) {
                return res.status(500).json({
                    message: "Enter valid email"
                });
            }
            // validation
            if (
                !name ||
                !mobile ||
                !businessName ||
                !customerType ||
                !status
            ) {
                return res.status(400).json({
                    message: "Required fields are missing"
                });
            }

            const existingCustomer = await prisma.customer.findUnique({
                where: {
                    email
                }
            });

            if (existingCustomer) {
                return res.status(409).json({
                    success: false,
                    message: "Customer with this email already exists"
                });
            }
            // create customer
            const customer = await prisma.customer.create({
                data: {
                    name,
                    mobile,
                    email,
                    businessName,
                    gstNumber,
                    customerType,
                    address,
                    status,
                    followUpDate: followUpDate
                        ? new Date(followUpDate)
                        : null
                }
            });

            return res.status(201).json({
                success: true,
                message: "Customer created successfully",
                customer
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


// get all customers
customerRouter.get("/",userauth,
    async (req, res) => {
        try {

            const { search } = req.query;

            let customers;

            if (search) {

                customers = await prisma.customer.findMany({
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                mobile: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                businessName: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                });

            } else {

                customers = await prisma.customer.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                });

            }

            return res.status(200).json({
                success: true,
                count: customers.length,
                customers
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


// get customer detail by id
customerRouter.get("/:id",userauth,
    async (req, res) => {
        try {

            const customerId = Number(req.params.id);

            if (Number.isNaN(customerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            const customer = await prisma.customer.findUnique({
                where: {
                    id: customerId
                },
                include: {
                    followups: {
                        orderBy: {
                            createdAt: "desc"
                        }
                    }
                }
            });

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            return res.status(200).json({
                success: true,
                customer
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


// UPDATE CUSTOMER
customerRouter.put("/:id",
    userauth,
    roleauth("ADMIN", "SALES"),
    async (req, res) => {
        try {

            const customerId = Number(req.params.id);

            if (Number.isNaN(customerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            const {
                name,
                mobile,
                email,
                businessName,
                gstNumber,
                customerType,
                address,
                status,
                followUpDate
            } = req.body;

            const existingCustomer = await prisma.customer.findUnique({
                where: {
                    id: customerId
                }
            });

            if (!existingCustomer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }

            const parsedDate = new Date(followUpDate);
            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid follow-up date"
                });
            }

            const customer = await prisma.customer.update({
                where: {
                    id: customerId
                },
                data: {
                    name,
                    mobile,
                    email,
                    businessName,
                    gstNumber,
                    customerType,
                    address,
                    status,
                    followUpDate: followUpDate
                        ? new Date(followUpDate)
                        : null
                }
            });

            return res.status(200).json({
                success: true,
                message: "Customer updated successfully",
                customer
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

// ADD FOLLOW-UP

customerRouter.post("/:id/followups",
    userauth,
    roleauth("ADMIN", "SALES"),
    async (req, res) => {
        try {

            const customerId = Number(req.params.id);

            if (Number.isNaN(customerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customer ID"
                });
            }

            const { note, followUpDate } = req.body;

            if (!note || !followUpDate) {
                return res.status(400).json({
                    success: false,
                    message: "Note and follow-up date are required"
                });
            }
            if (!note || typeof note !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid note is required"
                });
            }

            if (note.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: "Note must be at least 3 characters"
                });
            }

            if (note.trim().length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Note cannot exceed 500 characters"
                });
            }

            const parsedDate = new Date(followUpDate);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid follow-up date"
                });
            }

            const customer = await prisma.customer.findUnique({
                where: {
                    id: customerId
                }
            });

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }
            

            const followup = await prisma.customerFollowup.create({
                data: {
                    customerId,
                    note,
                    followUpDate: new Date(followUpDate),
                    createdById: req.user.id
                }
            });

            return res.status(201).json({
                success: true,
                message: "Follow-up added successfully",
                followup
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


module.exports = customerRouter;