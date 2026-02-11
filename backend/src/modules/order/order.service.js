import mongoose from "mongoose";
import Order from "./order.model.js";
import Product from "../inventory/product.model.js";
import redis from "../../config/redis.js";
import { acquireLock, releaseLock } from "../../utils/redisLock.js";

const getCartKey = (userId) => `mvoms:cart:${userId}`;

export const checkout = async (userId) => {
    const cartKey = getCartKey(userId);
    const itemsRaw = await redis.hgetall(cartKey);

    if (!Object.keys(itemsRaw).length) {
        throw new Error("Cart is empty");
    }

    const items = Object.values(itemsRaw).map((item) =>
        JSON.parse(item)
    );

    const locks = [];

    // 🔐 Acquire locks
    for (const item of items) {
        const lockKey = `mvoms:lock:product:${item.productId}`;
        const lockValue = await acquireLock(lockKey, 5000);

        if (!lockValue) {
            throw new Error(
                `Product ${item.productId} is being purchased by another user`
            );
        }

        locks.push({ lockKey, lockValue });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalAmount = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId).session(session);

            if (!product) {
                throw new Error("Product not found");
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            product.stock -= item.quantity;
            await product.save({ session });

            totalAmount += item.quantity * product.price;
        }

        const order = await Order.create(
            [
                {
                    userId,
                    items,
                    totalAmount,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        await redis.del(cartKey);

        return order[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        for (const lock of locks) {
            await releaseLock(lock.lockKey, lock.lockValue);
        }
    }
};
