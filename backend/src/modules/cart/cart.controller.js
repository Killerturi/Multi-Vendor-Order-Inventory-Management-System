import * as cartService from "./cart.service.js";

export const addItem = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;

    await cartService.addToCart(userId, {
        productId,
        quantity,
        price,
    });

    res.json({ message: "Item added to cart" });
};


export const getUserCart = async (req, res) => {
    const { userId } = req.params;

    const cart = await cartService.getCart(userId);

    res.json(cart);
};

export const removeItem = async (req, res) => {
    const { userId, productId } = req.params;

    await cartService.removeFromCart(userId, productId);

    res.json({ message: "Item removed" });
};

export const clearUserCart = async (req, res) => {
    const { userId } = req.params;

    await cartService.clearCart(userId);

    res.json({ message: "Cart cleared" });
};
