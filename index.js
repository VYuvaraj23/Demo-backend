import express from "express";
import cors from "cors";
import logger from "./src/middleware/longer.middleware.js";
import config from "./src/config/index.config.js";
import routes from "./src/Routes/index.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use(routes);

app.listen(config.PORT, () => {
  console.log(`Server Listening ${config.PORT}`);
});
