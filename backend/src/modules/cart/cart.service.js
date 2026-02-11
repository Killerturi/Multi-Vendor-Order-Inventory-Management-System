import redis from "../../config/redis.js";

const CART_TTL = 60 * 30; // 30 minutes

const getCartKey = (userId) => `mvoms:cart:${userId}`;

export const addToCart = async (userId, product) => {
    const cartKey = getCartKey(userId);

    const existing = await redis.hget(cartKey, product.productId);

    if (existing) {
        const parsed = JSON.parse(existing);
        parsed.quantity += product.quantity;

        await redis.hset(cartKey, product.productId, JSON.stringify(parsed));
    } else {
        await redis.hset(
            cartKey,
            product.productId,
            JSON.stringify(product)
        );
    }

    await redis.expire(cartKey, CART_TTL);
};

export const getCart = async (userId) => {
    const cartKey = getCartKey(userId);

    const items = await redis.hgetall(cartKey);

    return Object.values(items).map((item) => JSON.parse(item));
};

export const removeFromCart = async (userId, productId) => {
    const cartKey = getCartKey(userId);

    await redis.hdel(cartKey, productId);
};

export const clearCart = async (userId) => {
    const cartKey = getCartKey(userId);

    await redis.del(cartKey);
};
