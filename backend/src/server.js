import app from "./app.js";
import "./config/redis.js"; // just importing initializes connection

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
