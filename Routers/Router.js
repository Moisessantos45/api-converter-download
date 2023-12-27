import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as sendMusica from "../controllers/ControllerInicio.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./Uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const newFilename = `${file.originalname}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/convertir", upload.array("music"), sendMusica.convertirMusic);
router.post("/descargar", sendMusica.descarVideo);

export default router;
