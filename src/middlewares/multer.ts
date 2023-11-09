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

const uploadImage = multer({ storage: storage });
const uploadSong = multer();

export default {
  uploadImage,
  uploadSong,
};
