const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const PlatesController = require("../controllers/PlatesController");
const platesController = new PlatesController();

const ensureAuth = require("../middlwares/ensureAuth");
const ensureAdmin = require("../middlwares/ensureAdmin");

const platesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

platesRoutes.use(ensureAuth);

platesRoutes.post(
  "/",
  ensureAdmin,
  upload.single("img", platesController.create)
);
platesRoutes.get("/", platesController.index);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", ensureAdmin, platesController.delete);
platesRoutes.put(
  "/:id",
  ensureAdmin,
  upload.single("img"),
  platesController.update
);

module.exports = platesRoutes;
