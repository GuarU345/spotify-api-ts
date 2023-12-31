import multer from "multer";
import { v4 } from "uuid";
import { extname } from "path";

const storage = multer.diskStorage({
  destination: "./upload",
  filename: function (req, file, cb) {
    const name = v4();

    const ext = extname(file.originalname);

    cb(null, name + ext);
  },
});

export const upload = multer({ storage: storage });
