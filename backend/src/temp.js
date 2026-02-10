import redis from "./config/redis.js";

(async () => {
    await redis.set("mvoms:test", "Redis is working");
    const value = await redis.get("mvoms:test");
    console.log(value);
    process.exit(0);
})();
