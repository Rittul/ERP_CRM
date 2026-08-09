const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    // =========================
    // USERS
    // =========================

    const passwordHash = await bcrypt.hash("Password123", 10);

    const users = [
        {
            name: "admin user",
            email: "admin@example.com",
            passwordHash,
            role: "ADMIN",
        },
        {
            name: "sales user",
            email: "sales@example.com",
            passwordHash,
            role: "SALES",
        },
        {
            name: "warehouse user",
            email: "warehouse@example.com",
            passwordHash,
            role: "WAREHOUSE",
        },
        {
            name: "accounts user",
            email: "accounts@example.com",
            passwordHash,
            role: "ACCOUNTS",
        },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {},
            create: user,
        });
    }


    // =========================
    // CATEGORIES
    // =========================

    const categories = [
        "Electronics",
        "Furniture",
        "Stationery",
        "Hardware",
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: {
                name: name,
            },
            update: {},
            create: {
                name: name,
            },
        });
    }


    // =========================
    // WAREHOUSE
    // =========================

    const existingWarehouse = await prisma.warehouse.findFirst({
        where: {
            name: "Main Warehouse",
        },
    });

    if (!existingWarehouse) {
        await prisma.warehouse.create({
            data: {
                name: "Main Warehouse",
                location: "Delhi",
            },
        });
    }


    console.log("Seed data created successfully");
}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });