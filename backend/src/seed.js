
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "./modules/inventory/product.model.js";

await mongoose.connect(process.env.MONGO_URI);

await Product.deleteMany();

await Product.create([
    { name: "Laptop", price: 50000, stock: 2 },
    { name: "Phone", price: 20000, stock: 1 }
]);

console.log("Seeded products");
process.exit();
