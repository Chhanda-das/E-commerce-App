import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1000000) +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,
});

export default upload;