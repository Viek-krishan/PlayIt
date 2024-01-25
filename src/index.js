import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "../env", // give the path of your env file which most will be at root directory
});

ConnectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERRRR", err);
    });

    app.listen(process.env.PORT || 2000, () => {
      console.log("Server is running at the post:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed", err);
  });
