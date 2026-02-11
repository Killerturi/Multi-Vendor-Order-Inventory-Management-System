import express from "express";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";

const app = express();

app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

export default app;   // 👈 THIS LINE IS REQUIRED
