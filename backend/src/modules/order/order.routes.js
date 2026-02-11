import express from "express";
import { checkoutUser } from "./order.controller.js";

const router = express.Router();

router.post("/checkout", checkoutUser);

export default router;
