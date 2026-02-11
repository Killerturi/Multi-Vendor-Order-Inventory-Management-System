import express from "express";
import * as cartController from "./cart.controller.js";

const router = express.Router();

router.get("/:userId", cartController.getUserCart);

router.post("/:userId/items", cartController.addItem);

router.delete("/:userId/items/:productId", cartController.removeItem);

router.delete("/:userId", cartController.clearUserCart);

export default router;
