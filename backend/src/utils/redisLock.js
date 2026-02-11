import redis from "../config/redis.js";
import crypto from "crypto";

export const acquireLock = async (key, ttl = 5000) => {
    const lockValue = crypto.randomUUID();

    const result = await redis.set(key, lockValue, "NX", "PX", ttl);

    if (!result) {
        return null; // lock not acquired
    }

    return lockValue;
};

export const releaseLock = async (key, lockValue) => {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1]
    then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

    await redis.eval(script, 1, key, lockValue);
};
