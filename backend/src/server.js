const express =require("express");
const app= express();
require('dotenv').config();
const cors=require("cors");
const cookieParser = require("cookie-parser");
const prisma = require("./config/prisma");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

app.get("/",(req,res)=>{
    res.send("backend running!");
});

const authRouter= require("./routes/auth");
const customerRouter= require("./routes/customers");
const ProductRouter= require("./routes/products");
const inventoryRouter= require("./routes/inventory");
const challanRouter= require("./routes/challan");

app.use("/",authRouter);
app.use("/customers",customerRouter);
app.use("/products",ProductRouter);
app.use("/inventory",inventoryRouter);
app.use("/challan",challanRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,(req,res)=>{
    console.log(`server listening on port ${PORT}`);
})