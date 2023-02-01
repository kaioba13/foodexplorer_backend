require("express-async-errors");
const database = require("./database/sqlite");
const express = require("express");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const cors = require("cors");
const uploadConfig = require("./configs/upload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

database();

app.use((error, request, respone, next) => {
  if (error instanceof AppError) {
    return respone.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }
  console.error(error);

  return respone.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 7000;
app.listen(PORT, () => console.log(`the server is running on port ${PORT}`));
