import * as orderService from "./order.service.js";

export const checkoutUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const order = await orderService.checkout(userId);

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
