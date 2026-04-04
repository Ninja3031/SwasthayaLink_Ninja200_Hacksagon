import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { server } from "./socket.js";

// Load env vars
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`⚙️ SwasthyaLink REST & Socket HTTP Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
